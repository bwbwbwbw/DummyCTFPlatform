import angular from 'angular';
import NProgress from 'nprogress';

import configRouter from 'config/router';

const app = angular
  .module('dummyctf.dashboard', ['dummyctf.shared'])
  .config(configRouter)
  .run(['$transitions', $transitions => {
    $transitions.onEnter({}, function () { NProgress.start(); });
    $transitions.onFinish({}, function () { NProgress.done(); });
  }]);

const userbaseCtrlCtx = require.context('controllers/dashboard/', true, /\.js$/);
userbaseCtrlCtx.keys().map(userbaseCtrlCtx);

export default app;
