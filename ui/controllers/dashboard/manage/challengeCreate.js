import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.challenge = {
      name: 'Unnamed Challenge',
      category: 'misc',
      difficulty: 0,
    };
  }

  doCreate() {
    this.Challenge
      .create(this.challenge)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.create.successMsg'));
        this.$state.go('manage_challenge');
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeCreateController', Controller);
