import angular from 'angular';

import CSRFInjector from 'services/csrfInjector';
import User from 'services/user';
import Challenge from 'services/challenge';

const app = angular
  .module('dummyctf.services', [])
  .service('CSRFInjector', CSRFInjector)
  .service('User', User)
  .service('Challenge', Challenge)
  ;

export default app;
