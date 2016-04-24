import glob from 'glob';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const router = Router();
  parentRouter.use('/api', router);

  const controllers = glob.sync(`${__dirname}/api/*.js`);
  controllers.forEach(controller => require(controller).default(DI, router, app));

};

