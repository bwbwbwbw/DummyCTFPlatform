import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const miscService = DI.get('miscService');
  const userService = DI.get('userService');

  const router = Router();
  parentRouter.use('/user', router);

  router.post('/signin',
    userService.checkBodyForCredential,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const user = await userService.authenticate(req.body.username, req.body.password);
      req.session.user = user;
      res.json({});
    }
  );

  router.post('/register',
    userService.checkBodyForCredential,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const user = await userService.createUser(req.body.username, req.body.password, ['CONTESTER']);
      req.session.user = user;
      res.json({});
    }
  );

  router.post('/logout',
    (req, res) => {
      req.session.destroy();
      res.json({});
    }
  );

};
