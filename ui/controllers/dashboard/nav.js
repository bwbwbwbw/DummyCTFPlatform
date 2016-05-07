import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  doLogout() {
    this.User
      .logout()
      .then(resp => {
        window.location.reload();
      });
  }
}

Controller.$inject = ['toastr', 'User', '$translate'];

angular
  .module('dummyctf.dashboard')
  .controller('navController', Controller);
