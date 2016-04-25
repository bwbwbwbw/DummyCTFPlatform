import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/skin-red-light.min.css';
import 'jquery';
import 'bootstrap';
import 'admin-lte';
import 'admin-lte/plugins/slimScroll/jquery.slimscroll.min.js';
import 'angular-toastr/dist/angular-toastr.min.css';

import 'components/typography.styl';
import 'components/misc.styl';

import angular from 'angular';
import angularTranslate from 'angular-translate';
import angularSanitize from 'angular-sanitize';
import angularAnimate from 'angular-animate';
import angularUiBootstrap from 'angular-ui-bootstrap';
import angularDialog from 'angular-dialog-service';
import angularToastr from 'angular-toastr';

import configToastr from 'config/toastr';
import configXHR from 'config/xhr';
import configCSRF from 'config/csrf';
import configTranslation from 'config/translation';
import userService from 'services/user';
import navController from 'controllers/nav';
import signInController from 'controllers/signin';
import registerController from 'controllers/register';

const app = angular.module('dummyctf.dashboard', [
  angularTranslate,
  angularSanitize,
  angularAnimate,
  angularUiBootstrap,
  angularDialog,
  angularToastr,
  userService,
]);

app
  .config(configToastr)
  .config(configXHR)
  .config(configCSRF)
  .config(configTranslation)
  .controller('navController', navController)
  .controller('signInController', signInController)
  .controller('registerController', registerController);
