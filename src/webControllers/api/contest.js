import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import _ from 'lodash-joins';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');
  const challengeService = DI.get('challengeService');

  const router = Router();
  parentRouter.use('/contests', router);

  router.get('/',
    async (req, res) => {
      const contests = await contestService.getContests();
      const contestChallengeCount = await contestService.groupContestChallengeCount();
      const contestRegistrantCount = await contestService.groupContestRegistrantCount();
      const accessor = (d) => String(d._id);
      let result = contests.map(v => v.toObject());
      result = _.hashLeftOuterJoin(result, accessor, contestChallengeCount, accessor);
      result = _.hashLeftOuterJoin(result, accessor, contestRegistrantCount, accessor);
      res.json(result);
    }
  );

  router.post('/',
    contestService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const contest = await contestService.createContest(req.body);
      res.json(contest);
    }
  );

  router.get('/:id',
    async (req, res) => {
      const contest = await contestService.getContestObjectById(req.params.id);
      res.json(contest);
    }
  );

  router.get('/:id/allChallenges',
    async (req, res) => {
      const challenges = await contestService.getAllChallenges(req.params.id);
      res.json(challenges);
    }
  );

  // A list of challenge that could be added to the contest
  router.get('/:id/availableChallenges',
    async (req, res) => {
      const existChallenge = _.keyBy(
        await contestService.getAllChallenges(req.params.id),
        (cc) => cc.challenge.id
      );
      const challenges = _.filter(
        await challengeService.getChallenges(),
        (c) => existChallenge[c.id] === undefined
      );
      res.json(challenges);
    }
  );

  router.put('/:id',
    contestService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const contest = await contestService.updateContest(req.params.id, req.body);
      res.json(contest);
    }
  );

  router.put('/:id/challenges',
    contestService.checkBodyForAddChallenge,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const contest = await contestService.addChallenge(
        req.params.id,
        req.body.challenge,
        req.body
      );
      res.json(contest);
    }
  );
};
