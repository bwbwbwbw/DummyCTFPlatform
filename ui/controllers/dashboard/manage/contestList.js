import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.contests = this.Contest.query();
    this.contests.$promise
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.contest.list.failMsg'),
          resp.data.msgHtml
        );
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestListController', Controller);
