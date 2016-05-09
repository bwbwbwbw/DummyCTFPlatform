import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  async load() {
    this.contest = (await this.Contest.get(this.$stateParams.id)).data;
    this.contestChallenges = (await this.Contest.getAllChallenges(this.$stateParams.id)).data;
    this.$rootScope.$apply();
  }
}

Controller.$inject = ['$stateParams', '$rootScope', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestInfoController', Controller);
