import angular from 'angular';

import CSRFInjector from 'services/csrfInjector';
import User from 'services/user';
import Challenge from 'services/challenge';
import Contest from 'services/contest';

const app = angular
  .module('dummyctf.services', [])
  .service('CSRFInjector', CSRFInjector)
  .service('User', User)
  .service('Challenge', Challenge)
  .service('Contest', Contest)
  ;

export default app;
