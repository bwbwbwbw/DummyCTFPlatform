import glob from 'glob';

export default (DI, app) => {

  const controllers = glob.sync(`${__codeRoot}/webControllers/*.js`);
  controllers.forEach(controller => require(controller).default(DI, app));

  // Fallback: Generate 404
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Handle BADCSRFTOKEN
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
      return next(err)
    }
    err = new UserError('Bad CSRF token');
    err.status = 403;
    next(err);
  });

  // Handle Non-User Errors
  app.use((err, req, res, next) => {
    if (err.status === undefined) {
      err.status = 500;
    }
    if (err.status === 500) {
      err.message = `Server internal error: ${err.message}`;
    }
    next(err);
  });

  // Handle Error outputs
  app.use((err, req, res, next) => {
    const errObject = {
      err: true,
      status: err.status,
      msg: err.message,
      name: err.name,
      stack: err.stack,
    };
    if (req.xhr) {
      res.json(errObject);
    } else {
      res.status(err.status);
      res.render('error', { error: errObject });
    }
  });

}
