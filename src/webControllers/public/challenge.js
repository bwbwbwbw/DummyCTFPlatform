import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import i18n from 'i18n';
import _ from 'lodash-joins';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');
  const submissionService = DI.get('submissionService');
  const systemPropertyService = DI.get('systemPropertyService');

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
