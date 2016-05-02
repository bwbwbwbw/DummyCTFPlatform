import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  doLogout() {
    this.User
      .logout()
      .then(resp => {
        window.location.reload();
      })
      .catch(resp => {
        this.toastr.error(this.$translate.instant('ui.page.signout.successMsg', resp.data));
      });
  }
}

Controller.$inject = ['toastr', 'User', '$translate'];

angular
  .module('dummyctf.dashboard')
  .controller('navController', Controller);
