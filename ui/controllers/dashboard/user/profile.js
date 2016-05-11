import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...props) {
    super(...props);
    this.updatePass = {};
  }

  async doUpdateProfile() {
    await this.User.updateProfile(this.user.profile);
    this.$state.reload();
    this.toastr.success(this.$translate.instant('ui.page.user.profile.successMsg'));
  }

  async doUpdatePassword() {
    if (this.updatePass.password !== this.updatePass.password2) {
      this.dialogs.error(
        this.$translate.instant('ui.page.ajax.postFailMsg'),
        this.$translate.instant('ui.page.register.retypeNotMatchMsg')
      );
      return;
    }
    await this.User.updatePassword(this.updatePass);
    this.$state.reload();
    this.toastr.success(this.$translate.instant('ui.page.user.profile.updatePass.successMsg'));
  }
}

Controller.$inject = ['user', 'User', '$state', 'toastr', '$translate', 'dialogs'];

angular
  .module('dummyctf.dashboard')
  .controller('userProfileController', Controller);
