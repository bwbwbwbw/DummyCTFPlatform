import 'angular-datepicker/dist/index.min.css';
import 'textangular/dist/textAngular.css';
import 'balloon-css/balloon.min.css';
import 'angular-data-table/release/dataTable.css';

import angular from 'angular';
import angularTranslate from 'angular-translate';
import angularSanitize from 'angular-sanitize';
import angularAnimate from 'angular-animate';
import angularUiRouter from 'angular-ui-router';
import angularUiBootstrap from 'angular-ui-bootstrap';
import angularDialog from 'angular-dialog-service';
import angularToastr from 'angular-toastr';
import angularDatePicker from 'angular-datepicker/index.js';
import angularFormly from 'angular-formly';
import angularFormlyBootstrap from 'angular-formly-templates-bootstrap';
import 'angular-moment';
import 'angular-data-table/release/dataTable.helpers.js';
import textAngular from 'textangular';

import configToastr from 'config/toastr';
import configAjax from 'config/ajax';
import configCsrf from 'config/csrf';
import configTranslation from 'config/translation';
import configTextAngular from 'config/textAngular';

const app = angular
  .module('dummyctf.shared', [
    angularTranslate,
    angularSanitize,
    angularAnimate,
    angularUiRouter,
    angularUiBootstrap,
    angularDialog,
    angularToastr,
    angularDatePicker,
    angularFormly,
    angularFormlyBootstrap,
    'angularMoment',
    'data-table',
    textAngular,
    'dummyctf.services',
  ])
  .run(['amMoment', amMoment => {
    amMoment.changeLocale('zh-cn');
  }])
  .config(configToastr)
  .config(configAjax)
  .config(configCsrf)
  .config(configTranslation)
  .config(configTextAngular)
  ;

const sharedCtrlCtx = require.context('controllers/shared/', true, /\.js$/);
sharedCtrlCtx.keys().map(sharedCtrlCtx);

export default app;
