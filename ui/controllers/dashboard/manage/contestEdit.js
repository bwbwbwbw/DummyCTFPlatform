import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doUpdate() {
    await this.Contest.update(this.contest._id, this.contest);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.edit.basic.successMsg'));
    this.$state.go('manage_contest_info', {id: this.contest._id });
  }
}

Controller.$inject = ['availableValidators', 'contest', 'toastr', '$translate', '$state', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestEditController', Controller);
