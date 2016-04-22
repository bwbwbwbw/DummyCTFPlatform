import nunjucks from 'nunjucks';

export default (DI, app) => {

  app.set('views', `${__projectRoot}/views`);
  app.set('view engine', 'nunjucks');

  const njenv = nunjucks.configure(`${__projectRoot}/views`, {
    autoescape: true,
    express: app,
    watch: true,
  });

  // Notice that this would not escape chars like < and >
  njenv.addFilter('json', (str) => {
    return JSON.stringify(str);
  });

}
