import glob from 'glob';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const router = Router();
  parentRouter.use('/public', router);

  const controllers = glob.sync(`${__dirname}/public/*.js`);
  controllers.forEach(controller => require(controller).default(DI, router, app));

};

