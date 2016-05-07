import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  load() {
    this.Challenge
      .get(this.$stateParams.id)
      .then(resp => {
        this.challenge = resp.data;
      });
  }

  doSetFlag() {
    this.Challenge
      .setFlag(this.challenge._id, this.challenge.flag)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.flag.successMsg'));
        this.challenge.flag = '';
        this.challenge.flagThumb = resp.data.flagThumb;
      });
  }

  doUpdate() {
    this.Challenge
      .update(this.challenge._id, this.challenge)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.basic.successMsg'));
        this.$state.go('manage_challenge');
      });
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeEditController', Controller);
