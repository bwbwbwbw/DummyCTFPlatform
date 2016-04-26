import angular from 'angular';

import configRouter from 'config/router';
import navController from 'controllers/dashboard/nav';
import manageController from 'controllers/dashboard/manage';
import manageChallengeListController from 'controllers/dashboard/manage/challengeList';
import manageChallengeCreateController from 'controllers/dashboard/manage/challengeCreate';
import manageChallengeEditController from 'controllers/dashboard/manage/challengeEdit';

const app = angular
  .module('dummyctf.dashboard', ['dummyctf.shared'])
  .config(configRouter)
  .controller('navController', navController)
  .controller('manageController', manageController)
  .controller('manageChallengeListController', manageChallengeListController)
  .controller('manageChallengeCreateController', manageChallengeCreateController)
  .controller('manageChallengeEditController', manageChallengeEditController)
  ;

export default app;
