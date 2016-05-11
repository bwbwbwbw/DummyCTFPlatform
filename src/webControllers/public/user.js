import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

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
      const user = await userService.createUser(req.body.username, req.body.password, ['USER', 'CONTESTER']);
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

  router.get('/profile',
    libRequestChecker.enforceRole(['USER']),
    async (req, res) => {
      const user = await userService.getUserObjectById(req.session.user._id);
      res.json({
        profile: user.profile,
        validated: user.validated,
      });
    }
  );

  router.get('/isValidated',
    (req, res) => {
      if (req.session && req.session.user) {
        res.json({ validated: req.session.user.validated, auth: true });
      } else {
        res.json({ validated: false, auth: false });
      }
    }
  );

  router.post('/profile',
    libRequestChecker.enforceRole(['USER']),
    userService.checkBodyForUpdateProfile,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const user = await userService.updateProfile(req.session.user._id, req.body);
      req.session.user = user;
      res.json({});
    }
  );

  router.post('/password',
    libRequestChecker.enforceRole(['USER']),
    userService.checkBodyForSetPassword,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      let original = String(req.body.originalPassword);
      const user = await userService.resetPassword(req.session.user._id, req.body.password, original);
      res.json({});
    }
  );

};
