import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.loadValidators();
    this.loadContest();
  }

  async loadValidators() {
    this.availableValidators = (await this.Contest.getAvailableValidators()).data;
  }

  async loadContest() {
    this.contest = (await this.Contest.get(this.$stateParams.id)).data;
    this.$rootScope.$apply();
  }

  async doUpdate() {
    await this.Contest.update(this.contest._id, this.contest);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.edit.basic.successMsg'));
    this.$state.go('manage_contest_info', {id: this.contest._id });
  }

}

Controller.$inject = ['toastr', '$translate', '$state', '$stateParams', '$rootScope', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestEditController', Controller);
