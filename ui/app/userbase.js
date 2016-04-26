import angular from 'angular';

import signInController from 'controllers/userbase/signin';
import registerController from 'controllers/userbase/register';

const app = angular
  .module('dummyctf.userbase', ['dummyctf.shared'])
  .controller('registerController', registerController)
  .controller('signInController', signInController)
  ;

export default app;
