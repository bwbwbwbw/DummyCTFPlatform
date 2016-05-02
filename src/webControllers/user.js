import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const router = Router();
  parentRouter.use('/user', router);

  router.get('/signin',
    (req, res) => {
      res.render('user/signin');
    }
  );

  router.get('/register',
    (req, res) => {
      res.render('user/register');
    }
  );

};
