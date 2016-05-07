import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.Challenge
      .query()
      .then(resp => {
        this.challenges = resp.data;
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeListController', Controller);
