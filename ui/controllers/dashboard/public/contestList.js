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
    this.loadContests();
  }

  loadContests() {
    this.Contest
      .queryPublic()
      .then(resp => this.contests = resp.data);
  }

  filterActiveContest(contest) {
    return (contest.state === 'READY' || contest.state === 'ACTIVE');
  }

  orderContest(contest) {
    return `${contestOrder[contest.state]}_${contest.begin}`;
  }

  doRegister(id, data = {}) {
    this.Contest
      .register(id, data)
      .then(resp => {
        if (resp.data.success === false) {
          this.dialogs.create(
            '/static/angular-views/public/contest_register.html',
            'publicContestRegisterController',
            { payload: resp.data.payload },
            { copy: true },
            'ctrl'
          ).result.then(dialogForm => {
            this.doRegister(id, {
              fromForm: true,
              ...dialogForm,
            });
          });
        } else {
          this.dialogs.notify(
            this.$translate.instant('ui.page.contest.register.successMsg'),
            this.$translate.instant('ui.page.contest.register.successBody') + (resp.data.extraInfo || '')
          );
          this.loadContests();
        }
      });
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('publicContestListController', Controller);
