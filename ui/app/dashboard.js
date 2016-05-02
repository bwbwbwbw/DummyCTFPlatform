import angular from 'angular';

import configRouter from 'config/router';

const app = angular
  .module('dummyctf.dashboard', ['dummyctf.shared'])
  .config(configRouter);

const userbaseCtrlCtx = require.context('controllers/dashboard/', true, /\.js$/);
userbaseCtrlCtx.keys().map(userbaseCtrlCtx);

export default app;
