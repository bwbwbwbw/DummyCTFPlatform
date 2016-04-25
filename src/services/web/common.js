import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import compress from 'compression';
import i18n from 'i18n';

export default (DI, app) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(i18n.init);

  app.use(compress());

}
