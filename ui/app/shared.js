import 'angular-datepicker/dist/index.min.css';

import angular from 'angular';
import angularResource from 'angular-resource';
import angularTranslate from 'angular-translate';
import angularSanitize from 'angular-sanitize';
import angularAnimate from 'angular-animate';
import angularUiRouter from 'angular-ui-router';
import angularUiBootstrap from 'angular-ui-bootstrap';
import angularDialog from 'angular-dialog-service';
import angularToastr from 'angular-toastr';
import angularDatePicker from 'angular-datepicker/index.js';
import textAngular from 'textangular';

import configToastr from 'config/toastr';
import configXHR from 'config/xhr';
import configCSRF from 'config/csrf';
import configTranslation from 'config/translation';
import configTextAngular from 'config/textAngular';

const app = angular
  .module('dummyctf.shared', [
    angularResource,
    angularTranslate,
    angularSanitize,
    angularAnimate,
    angularUiRouter,
    angularUiBootstrap,
    angularDialog,
    angularToastr,
    angularDatePicker,
    textAngular,
    'dummyctf.services',
  ])
  .config(configToastr)
  .config(configXHR)
  .config(configCSRF)
  .config(configTranslation)
  .config(configTextAngular)
  ;

export default app;
