import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  doCancel() {
    this.$window.history.back();
  }

  async doUpdateProfile() {
    await this.User.updateProfile(this.user.profile);
    this.$state.reload();
    this.toastr.success(this.$translate.instant('ui.page.user.profile.successMsg'));
  }
}

Controller.$inject = ['user', 'User', '$window', '$state', 'toastr', '$translate'];

angular
  .module('dummyctf.dashboard')
  .controller('userProfileController', Controller);
