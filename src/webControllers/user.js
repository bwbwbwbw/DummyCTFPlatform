import glob from 'glob';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const router = Router();
  parentRouter.use('/user', router);

  router.get('/signin',
    (req, res, next) => {
      res.render('user/signin');
    }
  );

  router.get('/register',
    (req, res, next) => {
      res.render('user/register');
    }
  );

};
