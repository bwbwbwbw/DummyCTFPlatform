import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
  }

  async doShowChallengeDetail(cc) {
    try {
      (await this.dialogs.create(
        '/static/angular-views/public/challenge_detail.html',
        'publicChallengeDetailController',
        { cc },
        { copy: true },
        'ctrl'
      ).result);
    } catch (ignore) {
      // TODO: Refresh on success submission
    }
  }
}

Controller.$inject = ['data', 'dialogs'];

angular
  .module('dummyctf.dashboard')
  .controller('publicChallengeListController', Controller);
