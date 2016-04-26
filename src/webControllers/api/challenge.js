import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const miscService = DI.get('miscService');
  const challengeService = DI.get('challengeService');

  const router = Router();
  parentRouter.use('/challenges', miscService.enforceRole(['ADMIN']), router);

  router.get('/',
    async (req, res) => {
      res.json(await challengeService.getChallenges());
    }
  );

  router.post('/',
    challengeService.checkBodyForCreateOrEdit,
    miscService.enforceCorrectBody,
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
    miscService.enforceCorrectBody,
    async (req, res) => {
      const challenge = await challengeService.updateChallenge(req.params.id, req.body);
      res.json(challenge);
    }
  );

  router.post('/:id/flag',
    challengeService.checkBodyForSetFlag,
    miscService.enforceCorrectBody,
    async (req, res) => {
      const challenge = await challengeService.updateChallengeFlag(req.params.id, req.body.flag);
      res.json(challenge);
    }
  );

};
