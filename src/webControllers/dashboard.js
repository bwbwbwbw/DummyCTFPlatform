import glob from 'glob';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const router = Router();
  parentRouter.use('/', router);

  router.get('/',
    (req, res) => {
      res.render('dashboard');
    }
  );

};
