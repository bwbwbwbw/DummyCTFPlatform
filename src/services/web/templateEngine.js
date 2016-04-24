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
  njenv.addFilter('json', (str) => {
    return JSON.stringify(str);
  });

  // Expose necessary object
  app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.config = config;
    next();
  });

}
