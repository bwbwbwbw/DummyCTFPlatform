import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  load() {
    this.Contest
      .get(this.$stateParams.id)
      .then(resp => {
        this.contest = resp.data;
      });
    this.Contest
      .getAllChallenges(this.$stateParams.id)
      .then(resp => {
        this.contestChallenges = resp.data;
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestInfoController', Controller);
