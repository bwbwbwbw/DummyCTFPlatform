import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.contestChallenge = {
      score: 100,
      scoreDecrease: 0,
      minScore: 100,
    };
    this.load();
  }

  load() {
    this.Contest
      .get(this.$stateParams.id)
      .then(resp => {
        this.contest = resp.data;
      });
    this.Contest
      .getAvailableChallenges(this.$stateParams.id)
      .then(resp => {
        this.availableChallenges = resp.data;
      });
  }

  doAddContest() {
    this.Contest
      .addChallenge(this.$stateParams.id, this.contestChallenge)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.contest.challenge.add.successMsg'));
        this.$state.go('manage_contest_info', {id: this.$stateParams.id});
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestChallengeAddController', Controller);
