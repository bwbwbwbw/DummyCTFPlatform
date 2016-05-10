import Router from 'express-promise-router';

export default (DI, app, validator) => {

  const router = Router();
  app.use('/validator', router);

  validator.getValidators().forEach(v => {
    if (v.registerController) {
      v.registerController(router);
    }
  });

  return router;

};
