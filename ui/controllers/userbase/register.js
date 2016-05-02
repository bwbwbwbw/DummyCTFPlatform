import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.formDisabled = false;
    this.username = '';
    this.password = '';
    this.password2 = '';
  }

  doRegister() {
    if (this.password !== this.password2) {
      this.dialogs.error(
        this.$translate.instant('ui.page.register.failMsg'),
        this.$translate.instant('ui.page.register.retypeNotMatchMsg')
      );
      return;
    }
    this.formDisabled = true;
    this.User
      .register(this.username, this.password)
      .then(resp => {
        window.location = '/';
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.register.failMsg'),
          resp.data.msgHtml
        );
        this.formDisabled = false;
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', 'User', '$translate'];

angular
  .module('dummyctf.userbase')
  .controller('registerController', Controller);
