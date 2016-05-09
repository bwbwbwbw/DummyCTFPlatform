import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  async load() {
    this.contests = (await this.Contest.query()).data;
    this.currentContestId = (await this.Contest.getCurrentContest()).data;
  }

  async doSetCurrentContest() {
    await this.Contest.setCurrentContest(this.currentContestId);
    window.location.reload();
  }
}

Controller.$inject = ['toastr', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestListController', Controller);
