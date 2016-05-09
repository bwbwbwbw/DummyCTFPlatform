import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.loadValidators();
    this.loadContest();
  }

  loadContest() {
    this.Contest
      .get(this.$stateParams.id)
      .then(resp => {
        this.contest = resp.data;
      });
  }

  loadValidators() {
    this.Contest
      .getAvailableValidators()
      .then(resp => {
        this.availableValidators = resp.data;
      });
  }

  doUpdate() {
    this.Contest
      .update(this.contest._id, this.contest)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.contest.edit.basic.successMsg'));
        this.$state.go('manage_contest_info', {id: this.contest._id });
      });
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestEditController', Controller);
