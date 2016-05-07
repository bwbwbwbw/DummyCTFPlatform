import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  load() {
    this.Contest
      .query()
      .then(resp => {
        this.contests = resp.data;
      });
    this.Contest
      .getCurrentContest()
      .then(resp => {
        this.currentContestId = resp.data;
      });
  }

  doSetCurrentContest() {
    this.Contest
      .setCurrentContest(this.currentContestId)
      .then(() => {
        window.location.reload();
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestListController', Controller);
