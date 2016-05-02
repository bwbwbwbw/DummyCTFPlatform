import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const challengeService = DI.get('challengeService');

  const router = Router();
  parentRouter.use(
    '/challenges',
    libRequestChecker.enforceRole(['ADMIN']),
    router
  );

  router.get('/',
    async (req, res) => {
      const challenges = await challengeService.getChallenges();
      res.json(challenges);
    }
  );

  router.post('/',
    challengeService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const challenge = await challengeService.createChallenge(req.body);
      res.json(challenge);
    }
  );

  router.get('/:id',
    async (req, res) => {
      const challenge = await challengeService.getChallengeObjectById(req.params.id);
      res.json(challenge);
    }
  );

  router.put('/:id',
    challengeService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const challenge = await challengeService.updateChallenge(req.params.id, req.body);
      res.json(challenge);
    }
  );

  router.post('/:id/flag',
    challengeService.checkBodyForSetFlag,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const challenge = await challengeService.updateChallengeFlag(req.params.id, req.body.flag);
      res.json(challenge);
    }
  );

};
