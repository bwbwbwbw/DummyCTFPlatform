import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

const contestOrder = {
  ACTIVE: 3,
  READY: 2,
  UPCOMING: 1,
  DONE: 0,
};

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  load() {
    this.Contest
      .queryPublic()
      .then(resp => {
        this.contests = resp.data;
      });
  }

  filterActiveContest(contest) {
    return (contest.state === 'READY' || contest.state === 'ACTIVE');
  }

  orderContest(contest) {
    return `${contestOrder[contest.state]}_${contest.begin}`;
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('publicContestListController', Controller);
