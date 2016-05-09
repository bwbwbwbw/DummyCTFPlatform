import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doSetCurrentContest() {
    await this.Contest.setCurrentContest(this.currentContestId);
    window.location.reload();
  }
}

Controller.$inject = ['currentContestId', 'contests', 'toastr', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestListController', Controller);
