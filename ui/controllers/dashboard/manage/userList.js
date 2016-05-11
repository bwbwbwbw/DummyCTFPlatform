import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doResetPassword(user) {
    const form = (await this.dialogs.create(
      '/static/angular-views/manage/user_resetpass.html',
      'manageUserResetpassController',
      { user },
      { copy: true },
      'ctrl'
    ).result);
    if (form.password.length > 0) {
      await this.User.resetPassword(user._id, form.password);
      this.toastr.success(this.$translate.instant('ui.page.manage.user.resetPassword.successMsg'));
    }
  }

  showUserDetail(user) {
    alert(JSON.stringify(user, null, 4));
  }
}

Controller.$inject = ['users', 'dialogs', 'User', 'toastr', '$translate'];

angular
  .module('dummyctf.dashboard')
  .controller('manageUserListController', Controller);
