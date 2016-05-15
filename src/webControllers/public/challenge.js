import RateLimiter from 'rolling-rate-limiter';
import promisify from 'promisify-node';
import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import i18n from 'i18n';
import _ from 'lodash-joins';
import moment from 'moment';

export default (DI, parentRouter, app) => {

  const eventBus = DI.get('eventBus');
  const contestService = DI.get('contestService');
  const submissionService = DI.get('submissionService');
  const systemPropertyService = DI.get('systemPropertyService');

  const logger = DI.get('logger');

  // cache scoreboard
  let scoreboardCache = null;
  eventBus.on('contest.challenge.visibilityChanged', () => scoreboardCache = null);
  eventBus.on('contest.current.changed', () => scoreboardCache = null);
  eventBus.on('contest.submission.passed', () => scoreboardCache = null);
  eventBus.on('contest.registrant.new', () => scoreboardCache = null);

  const registrantLimiter = promisify(RateLimiter({
    redis: DI.get('redis'),
    namespace: 'limiter-flag-user',
    interval: 5 * 60 * 1000,
    maxInInterval: 10,
  }));

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

  async function limitRate(req, ccId) {
    let timeLeft = 0;
    if (!timeLeft) {
      timeLeft = await registrantLimiter(`${ccId}_${req.contestId}_${req.session.user._id}`);
    }
    /*
    if (!timeLeft) {
      timeLeft = await ipLimiter(`${ccId}_${req.connection.remoteAddress}`);
    }*/
    if (timeLeft) {
      throw new UserError(i18n.__('error.generic.limitExceeded', {
        minutes: (timeLeft / 1000 / 60).toFixed(1),
      }));
    }
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
      const events = await contestService.getEvents(req.contestId, true, 6);
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
      if (scoreboardCache !== null) {
        res.json(scoreboardCache);
        return;
      }

      const contest = await contestService.getContestObjectById(req.contestId);
      const submissions = await submissionService.getContestSucceededSubmissions(req.contestId);

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
        r.submissions = [];
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
        cr[userIdx].submissions.push({
          at: sm.createdAt.getTime(),
          newScore: cr[userIdx].score,
        });
        cr[userIdx].time = Math.max(cr[userIdx].time, sm.createdAt.getTime());
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

      // for top 15, calculate chart data
      const seriesCount = Math.min(cr.length, 15);
      const timestamps = _(cr)
        .take(seriesCount)
        .flatMap('submissions')
        .map('at')
        .sortBy()
        .uniq()
        .value();
      timestamps.unshift(contest.begin.getTime());
      timestamps.push(contest.end.getTime());
      const timestamp2index = _.invert(timestamps);
      const seriesData = _(cr)
        .take(seriesCount)
        .map(r => {
          const ret = new Array(timestamps.length);
          r.submissions.forEach(s => ret[timestamp2index[s.at]] = s.newScore);
          _.reduce(ret, (last, current, key) => {
            if (current === undefined) {
              ret[key] = last;
              return last;
            } else {
              return current;
            }
          }, 0);
          return ret;
        })
        .value();
      const series = _(cr)
        .take(seriesCount)
        .map('user.profile.nickname')
        .value();

      scoreboardCache = {
        contest: contest.toObject(),
        challenges: cc.map(c => c.challenge.name),
        data: cr.map((x, idx) => {
          return {
            verified: x.meta.validated ? 'Yes' : '',
            nickname: x.user.profile.nickname,
            score: x.score,
            time: x.time,
            order: idx + 1,
            ..._.mapKeys(x.row, (v, k) => `c_${k}`),
          };
        }),
        chart: {
          data: seriesData,
          series,
          labels: timestamps.map(t => moment(t).format('MM-DD HH:mm')),
        },
      };
      res.json(scoreboardCache);
    }
  );

  router.post('/:ccid/submit',
    libRequestChecker.enforceRole(['CONTESTER']),
    enforceCurrentContestExists,
    enforceCurrentContestRegistered,
    submissionService.checkBodyForSubmitFlag,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      await limitRate(req, req.params.ccid.toLowerCase());
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
