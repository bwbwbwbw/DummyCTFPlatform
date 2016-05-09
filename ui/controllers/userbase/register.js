import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.username = '';
    this.password = '';
    this.password2 = '';
  }

  async doRegister() {
    if (this.password !== this.password2) {
      this.dialogs.error(
        this.$translate.instant('ui.page.register.failMsg'),
        this.$translate.instant('ui.page.register.retypeNotMatchMsg')
      );
      return;
    }
    await this.User.register(this.username, this.password);
    window.location = '/';
  }
}

Controller.$inject = ['dialogs', 'User', '$translate'];

angular
  .module('dummyctf.userbase')
  .controller('registerController', Controller);
