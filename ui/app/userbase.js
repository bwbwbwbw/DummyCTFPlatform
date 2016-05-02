import angular from 'angular';

const app = angular
  .module('dummyctf.userbase', ['dummyctf.shared']);

const userbaseCtrlCtx = require.context('controllers/userbase/', true, /\.js$/);
userbaseCtrlCtx.keys().map(userbaseCtrlCtx);

export default app;
