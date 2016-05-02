import angular from 'angular';

const app = angular
  .module('dummyctf.services', [])
  ;

const serviceCtx = require.context('services/', true, /\.js$/);
serviceCtx.keys().map(serviceCtx);

export default app;
