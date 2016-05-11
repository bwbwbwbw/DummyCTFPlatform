import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
  }

  async doUpdateChallenge() {
    await this.Contest.updateChallenge(this.cc._id, this.cc);
    this.toastr.success(this.$translate.instant('ui.page.manage.contest.challenge.edit.successMsg'));
    this.$state.go('manage_contest_challenge_view', {id: this.cc.contest._id, cid: this.cc._id});
  }
}

Controller.$inject = ['cc', 'Contest', 'toastr', '$translate', '$state'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestChallengeEditController', Controller);
