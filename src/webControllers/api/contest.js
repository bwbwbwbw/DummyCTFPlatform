import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import _ from 'lodash';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');
  const challengeService = DI.get('challengeService');

  const router = Router();
  parentRouter.use(
    '/contests',
    libRequestChecker.enforceRole(['ADMIN']),
    router
  );

  router.get('/',
    async (req, res) => {
      const contests = await contestService.getContests();
      res.json(contests);
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

  router.get('/:id/challenges',
    async (req, res) => {
      const challenges = await contestService.getChallenges(req.params.id, false);
      res.json(challenges);
    }
  );

  // A list of challenge that could be added to the contest
  router.get('/:id/availableChallenges',
    async (req, res) => {
      const existChallenge = _.keyBy(
        await contestService.getChallenges(req.params.id, false),
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

};
