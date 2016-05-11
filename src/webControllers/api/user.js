import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const userService = DI.get('userService');

  const router = Router();
  parentRouter.use('/users', router);

  router.get('/',
    async (req, res) => {
      const users = await userService.getUsers();
      res.json(users);
    }
  );

  router.post('/:id/resetPassword',
    userService.checkBodyForSetPassword,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const user = await userService.resetPassword(req.params.id, req.body.password);
      res.json(user);
    }
  );

};
