import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.form = {};
  }

  doSubmit() {
    this.$uibModalInstance.close(this.form);
  }

  doSkip() {
    this.$uibModalInstance.close({ isSkip: true });
  }

  doCancel() {
    this.$uibModalInstance.dismiss('Canceled');
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$uibModalInstance', 'Contest', 'data'];

angular
  .module('dummyctf.dashboard')
  .controller('publicContestRegisterController', Controller);
