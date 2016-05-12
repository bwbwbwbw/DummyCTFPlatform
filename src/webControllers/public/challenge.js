import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import i18n from 'i18n';
import _ from 'lodash-joins';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');
  const submissionService = DI.get('submissionService');
  const systemPropertyService = DI.get('systemPropertyService');

  const logger = DI.get('logger');

  async function enforceCurrentContestExists(req, res, next) {
    const contestId = await systemPropertyService.get('current_contest', '');
    if (!contestId) {
      next(new UserError(i18n.__('error.contest.notfound')));
      return;
    }
    req.contestId = contestId;
    next();
  }

  async function enforceCurrentContestRegistered(req, res, next) {
    const reg = await contestService.getContestRegistration(
      req.contestId, req.session.user._id
    );
    if (reg === null) {
      next(new UserError(i18n.__('error.contest.notregistered')));
      return;
    }
    next();
  }

  const router = Router();
  parentRouter.use(
    '/challenges',
    router
  );

  router.get('/',
    libRequestChecker.enforceRole(['CONTESTER']),
    enforceCurrentContestExists,
    enforceCurrentContestRegistered,
    async (req, res) => {
      const contest = await contestService.getContestObjectById(req.contestId);
      let challenges = [];
      if (contest.state === 'ACTIVE' || contest.state === 'DONE') {
        challenges = await contestService.getVisibleChallenges(req.contestId);
      }
      const submissions = await submissionService.getUserSuccessSubmissions(
        req.session.user._id,
        req.contestId
      );
      challenges = _.hashLeftOuterJoin(
        challenges.map(cc => cc.toObject()),
        (cc) => String(cc.challenge._id),
        submissions.map(s => { return { _id: s.challenge, solved: true }; }),
        (s) => String(s._id)
      );
      const events = await contestService.getEvents(req.contestId);
      res.json({
        contest,
        challenges,
        events,
      });
    }
  );

  router.get('/scoreboard',
    enforceCurrentContestExists,
    async (req, res) => {
      const contest = await contestService.getContestObjectById(req.contestId);
      const submissions = await submissionService.getContestSubmissions(req.contestId);

      // all visible challenges
      let cc = [];
      if (contest.state === 'ACTIVE' || contest.state === 'DONE') {
        cc = await contestService.getVisibleChallenges(req.contestId);
      }
      // build ccId => index
      const ccId2index = {};
      cc.forEach((c, idx) => ccId2index[String(c._id)] = idx);

      // all contesters
      const cr = await contestService.getRegistrants(req.contestId);
      // build userId => index
      const userId2index = {};
      cr.forEach((r, idx) => userId2index[String(r.user._id)] = idx);
      cr.forEach(r => {
        r.score = 0;
        r.time = 0;
        r.row = new Array(cc.length);
      });

      const baseTime = contest.begin.getTime();

      // build table matrix
      submissions.forEach(sm => {
        const ccIdx = ccId2index[sm.cc];
        if (ccIdx === undefined) {
          logger.error('Failed to retrive contestChallenge %s for submission %s', sm.cc, sm._id);
          return;
        }
        const userIdx = userId2index[sm.user];
        if (userIdx === undefined) {
          logger.error('Failed to retrive user %s for submission %s', sm.user, sm._id);
          return;
        }
        cr[userIdx].row[ccIdx] = true;
        cr[userIdx].score += cc[ccIdx].score;
        cr[userIdx].time += sm.createdAt.getTime() - baseTime;
      });

      // sort
      cr.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        } else if (a.time !== b.time) {
          return a.time - b.time;
        } else {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
      });

      res.json({
        contest,
        challenges: cc.map(c => c.challenge.name),
        data: cr.map(x => {
          return {
            nickname: x.user.profile.nickname,
            score: x.score,
            time: x.time,
            ..._.mapKeys(x.row, (v, k) => `c_${k}`),
          };
        }),
      });
    }
  );

  router.post('/:ccid/submit',
    libRequestChecker.enforceRole(['CONTESTER']),
    enforceCurrentContestExists,
    enforceCurrentContestRegistered,
    submissionService.checkBodyForSubmitFlag,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const submission = await submissionService.addSubmission(
        req.session.user._id,
        req.connection.remoteAddress,
        req.params.ccid,
        req.body.flag.substr(0, 50)
      );
      res.json({ success: submission.valid });
    }
  );

};
