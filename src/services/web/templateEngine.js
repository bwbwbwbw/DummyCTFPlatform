import nunjucks from 'nunjucks';

export default (DI, app, config) => {

  app.set('views', `${__projectRoot}/ui/views`);
  app.set('view engine', 'nunjucks');

  const njenv = nunjucks.configure(`${__projectRoot}/ui/views`, {
    autoescape: true,
    express: app,
    watch: true,
  });

  // Notice that this would not escape chars like < and >
  njenv.addFilter('json', str => JSON.stringify(str));

  const userMethods = DI.get('db').User.schema.methods;
  njenv.addFilter('isContester', obj => userMethods.isContester.call(obj));
  njenv.addFilter('isAdmin', obj => userMethods.isAdmin.call(obj));

  // Expose necessary object
  app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.config = config;
    next();
  });

  return njenv;

};
