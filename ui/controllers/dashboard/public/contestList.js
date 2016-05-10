import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

const contestOrder = {
  ACTIVE: 3,
  READY: 2,
  UPCOMING: 1,
  DONE: 0,
};

export default class Controller extends ServiceInjector {
  filterActiveContest(contest) {
    return (contest.state === 'READY' || contest.state === 'ACTIVE');
  }

  orderContest(contest) {
    return `${contestOrder[contest.state]}_${contest.begin}`;
  }

  async doRegister(id, data = {}) {
    const resp = await this.Contest.register(id, data);
    if (resp.data.success === false) {
      const dialogForm = (await this.dialogs.create(
        '/static/angular-views/public/contest_register.html',
        'publicContestRegisterController',
        { payload: resp.data.payload },
        { copy: true },
        'ctrl'
      ).result);
      this.doRegister(id, {
        fromForm: true,
        ...dialogForm,
      });
    } else {
      this.dialogs.notify(
        this.$translate.instant('ui.page.contest.register.successMsg'),
        this.$translate.instant('ui.page.contest.register.successBody') + (resp.data.extraInfo || '')
      );
      this.$state.reload();
    }
  }

}

Controller.$inject = ['contests', 'dialogs', '$translate', '$state', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('publicContestListController', Controller);
