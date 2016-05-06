import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import compress from 'compression';
import i18n from 'i18n';

export default (DI, app) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(i18n.init);

  app.use(compress());

};
