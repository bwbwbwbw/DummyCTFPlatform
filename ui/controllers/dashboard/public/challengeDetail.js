import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.form = {
      flag: '',
    };
  }

  async doSubmitFlag() {
    if (this.form.flag) {
      const data = (await this.Contest.submitFlag(this.data.cc._id, this.form.flag)).data;
      if (!data.success) {
        this.dialogs.error(
          this.$translate.instant('ui.page.ajax.postFailMsg'),
          this.$translate.instant('ui.page.challenge.detail.wrongFlag'),
          { size: 'sm' }
        );
        return;
      } else {
        this.$uibModalInstance.close(data);
      }
    }
  }

  doCancel() {
    this.$uibModalInstance.dismiss('Canceled');
  }
}

Controller.$inject = ['$uibModalInstance', 'data', 'Contest', 'dialogs', '$translate'];

angular
  .module('dummyctf.dashboard')
  .controller('publicChallengeDetailController', Controller);
