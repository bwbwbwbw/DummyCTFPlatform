import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import _ from 'lodash-joins';

export default (DI, parentRouter, app) => {

  const eventBus = DI.get('eventBus');
  const systemPropertyService = DI.get('systemPropertyService');
  const contestService = DI.get('contestService');
  const challengeService = DI.get('challengeService');
  const validator = DI.get('validator');

  const router = Router();
  parentRouter.use('/contests', router);

  // Get current contest
  router.get('/current',
    async (req, res) => {
      res.json(await systemPropertyService.get('current_contest', ''));
    }
  );

  // Set current contest
  router.put('/current',
    async (req, res) => {
      let contestId = req.body.id;
      if (contestId === '') {
        contestId = null;
      }
      if (contestId !== null) {
        contestId = String(contestId);
      }
      await systemPropertyService.set('current_contest', contestId);
      eventBus.emit('contest.current.changed', contestId);
      res.json({});
    }
  );

  router.get('/availableValidators',
    async (req, res) => {
      const validators = validator.getValidators().map(v => {
        return {
          id: v.id,
          name: v.name,
        };
      });
      res.json(validators);
    }
  );

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

  // Get properties and details of a contest challenge
  router.get('/contestChallenge/:id',
    async (req, res) => {
      const cc = await contestService.getContestChallengeObjectById(req.params.id, true, true);
      res.json(cc);
    }
  );

  // Update properties of a contest challenge
  router.put('/contestChallenge/:id',
    contestService.checkBodyForEditChallenge,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const cc = await contestService.setChallengeProps(req.params.id, req.body);
      res.json(cc);
    }
  );

  // Set visibility of a contest challenge
  router.post('/contestChallenge/:id/visibility',
    contestService.checkBodyForSetChallengeVisibility,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const cc = await contestService.setChallengeVisibility(req.params.id, req.body.visibility === 'true');
      res.json(cc);
    }
  );

  // Set publish state of a contest event
  router.post('/events/:id/publish',
    contestService.checkBodyForSetEventPublishState,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const ce = await contestService.setEventPublishState(req.params.id, req.body.published === 'true');
      res.json(ce);
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

  router.get('/:id/events',
    async (req, res) => {
      const events = await contestService.getEvents(req.params.id, false);
      res.json(events);
    }
  );

  router.post('/:id/events',
    contestService.checkBodyForPublishEvent,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const event = await contestService.addEvent(
        req.params.id,
        'event.contest.announcement',
        req.body
      );
      res.json(event);
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

  router.post('/:id/challenges',
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
