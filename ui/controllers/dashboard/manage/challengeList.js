import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.loadChallenges();
  }

  async loadChallenges() {
    this.challenges = (await this.Challenge.query()).data;
    this.$rootScope.$apply();
  }
}

Controller.$inject = ['$rootScope', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeListController', Controller);
