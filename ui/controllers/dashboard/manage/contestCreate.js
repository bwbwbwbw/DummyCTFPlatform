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
  }

  async doCreate() {
    await this.Contest.create(this.contest);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.create.successMsg'));
    this.$state.go('manage_contest');
  }
}

Controller.$inject = ['availableValidators', 'toastr', '$translate', '$state', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestCreateController', Controller);
