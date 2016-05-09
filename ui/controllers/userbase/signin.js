import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.username = '';
    this.password = '';
  }

  async doSignIn() {
    await this.User.signIn(this.username, this.password);
    window.location = '/';
  }
}

Controller.$inject = ['User'];

angular
  .module('dummyctf.userbase')
  .controller('signInController', Controller);
