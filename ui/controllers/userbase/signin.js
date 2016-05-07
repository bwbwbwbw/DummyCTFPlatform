import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.username = '';
    this.password = '';
  }

  doSignIn() {
    this.User
      .signIn(this.username, this.password)
      .then(resp => {
        window.location = '/';
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', 'User', '$translate'];

angular
  .module('dummyctf.userbase')
  .controller('signInController', Controller);
