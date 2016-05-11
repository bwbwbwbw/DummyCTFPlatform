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

  doCancel() {
    this.$uibModalInstance.dismiss('Canceled');
  }
}

Controller.$inject = ['$uibModalInstance', 'data'];

angular
  .module('dummyctf.dashboard')
  .controller('manageUserResetpassController', Controller);
