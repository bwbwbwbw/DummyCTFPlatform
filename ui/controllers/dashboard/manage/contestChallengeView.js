import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doSetVisibility(visible) {
    if (this.cc.contest.state === 'ACTIVE') {
      try {
        await (this.dialogs.confirm(
          this.$translate.instant('ui.page.manage.contest.challenge.changeVisibility.dialogTitle'),
          this.$translate.instant('ui.page.manage.contest.challenge.changeVisibility.dialogContent')
        ).result);
      } catch (ignore) {
        // rejected
        return;
      }
    }
    await this.Contest.setChallengeVisibility(this.cc._id, visible);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.challenge.changeVisibility.successMsg'));
    this.$state.reload();
  }
}

Controller.$inject = ['cc', 'dialogs', '$translate', 'Contest', 'toastr', '$state'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestChallengeViewController', Controller);
