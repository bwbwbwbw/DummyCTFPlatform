import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.$scope.$on('$destroy', this.stopAutoRefresh.bind(this));
    this.startAutoRefresh();
    this.refreshAt = new Date();
  }

  stopAutoRefresh() {
    if (this.timer) {
      this.$interval.cancel(this.timer);
    }
  }

  startAutoRefresh() {
    this.timer = this.$interval(() => this.$state.reload(), 60 * 1000);
  }

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

Controller.$inject = ['data', 'dialogs', 'toastr', '$translate', '$state', '$scope', '$interval'];

angular
  .module('dummyctf.dashboard')
  .controller('publicChallengeListController', Controller);
