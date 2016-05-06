import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.basicFormDisabled = false;
    this.contest = {
      name: 'Unnamed Contest',
      regBegin: new Date(),
    };
  }

  doCreate() {
    this.basicFormDisabled = true;
    this.Contest
      .create(this.contest)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.contest.create.successMsg'));
        this.$state.go('manage_contest');
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.contest.create.failMsg'),
          resp.data.msgHtml
        );
      })
      .then(() => this.basicFormDisabled = false);
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Contest'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestCreateController', Controller);
