import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.challenges = this.Challenge.query();
    this.challenges.$promise
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.challenge.list.failMsg'),
          resp.data.msgHtml
        );
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeListController', Controller);
