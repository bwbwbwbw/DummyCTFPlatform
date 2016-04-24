import glob from 'glob';
import Router from 'express-promise-router';
import escapeHtml from 'escape-html';

export default (DI, app, logger) => {

  const router = Router();
  app.use(router);

  const controllers = glob.sync(`${__codeRoot}/webControllers/*.js`);
  controllers.forEach(controller => require(controller).default(DI, router, app));

  // Fallback: Generate 404
  app.use((req, res, next) => {
    const err = new Error('Page not found');
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
    if (err.status === 500) {
      logger.error(err);
    }
    res.status(err.status);
    const errObject = {
      err: true,
      status: err.status,
      msg: err.message,
      msgHtml: err.messageHtml || escapeHtml(err.message),
      name: err.name,
    };
    if (req.xhr) {
      res.json(errObject);
    } else {
      res.render('error', { error: errObject });
    }
  });

}
