import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.basicFormDisabled = false;
    this.challenge = {
      name: 'Unnamed Challenge',
      category: 'misc',
      difficulty: 0,
    };
  }

  doCreate() {
    this.basicFormDisabled = true;
    this.challenge
      .$save()
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.create.successMsg'));
        this.$state.go('manage_challenge');
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.challenge.create.failMsg'),
          resp.data.msgHtml
        );
      })
      .then(() => this.basicFormDisabled = false);
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeCreateController', Controller);
