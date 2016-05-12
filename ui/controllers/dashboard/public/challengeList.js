import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doShowChallengeDetail(cc) {
    try {
      const form = (await this.dialogs.create(
        '/static/angular-views/public/challenge_detail.html',
        'publicChallengeDetailController',
        { cc },
        { copy: true, size: 'md' },
        'ctrl'
      ).result);
      if (form.success) {
        this.toastr.success(this.$translate.instant('ui.page.challenge.detail.successMsg'));
        this.$state.reload();
      }
    } catch (ignore) {
      // ignore
    }
  }
}

Controller.$inject = ['data', 'dialogs', 'toastr', '$translate', '$state'];

angular
  .module('dummyctf.dashboard')
  .controller('publicChallengeListController', Controller);
