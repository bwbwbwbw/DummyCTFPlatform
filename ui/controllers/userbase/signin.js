import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.formDisabled = false;
    this.username = '';
    this.password = '';
  }

  doSignIn() {
    this.formDisabled = true;
    this.User
      .signIn(this.username, this.password)
      .then(resp => {
        window.location = '/';
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.signin.failMsg'),
          resp.data.msgHtml
        );
        this.formDisabled = false;
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', 'User', '$translate'];

angular
  .module('dummyctf.userbase')
  .controller('signInController', Controller);
