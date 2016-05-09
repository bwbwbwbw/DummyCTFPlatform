import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.contest = {
      name: 'Unnamed Contest',
      regBegin: new Date(),
      validator: 'none',
    };
    this.loadValidators();
  }

  async loadValidators() {
    this.availableValidators = (await this.Contest.getAvailableValidators()).data;
    this.$rootScope.$apply();
  }

  async doCreate() {
    await this.Contest.create(this.contest);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.create.successMsg'));
    this.$state.go('manage_contest');
  }
}

Controller.$inject = ['toastr', '$translate', '$state', '$rootScope', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestCreateController', Controller);
