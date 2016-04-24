import Router from 'express-promise-router';
import { roles } from 'constants/index';

export default (DI, parentRouter, app) => {

  const miscService = DI.get('miscService');
  const userService = DI.get('userService');

  const router = Router();
  parentRouter.use('/user', router);

  router.post('/signin',
    userService.checkBodyForCredential,
    miscService.enforceCorrectBody,
    async (req, res, next) => {
      const user = await userService.authenticate(req.body.username, req.body.password);
      req.session.user = user;
      res.json({});
    }
  );

  router.post('/register',
    userService.checkBodyForCredential,
    miscService.enforceCorrectBody,
    async (req, res, next) => {
      const user = await userService.createUser(req.body.username, req.body.password, [roles.ROLE_CONTESTER]);
      req.session.user = user;
      res.json({});
    }
  );

  router.post('/logout',
    (req, res, next) => {
      req.session.destroy();
      res.json({});
    }
  );

};
