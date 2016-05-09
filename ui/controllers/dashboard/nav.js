import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doLogout() {
    await this.User.logout();
    window.location.reload();
  }
}

Controller.$inject = ['User'];

angular
  .module('dummyctf.dashboard')
  .controller('navController', Controller);
