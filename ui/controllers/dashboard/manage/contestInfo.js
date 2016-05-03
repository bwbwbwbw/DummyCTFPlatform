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
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.contest.info.load.failMsg'),
          resp.data.msgHtml
        );
      });
    this.Contest
      .getChallenges(this.$stateParams.id)
      .then(resp => {
        this.challenges = resp.data;
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.contest.info.load.failMsg'),
          resp.data.msgHtml
        );
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestInfoController', Controller);
