import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.setFlagFormDisabled = false;
    this.load();
  }

  load() {
    this.Challenge
      .get(this.$stateParams.id)
      .then(resp => {
        this.challenge = resp.data;
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.challenge.edit.load.failMsg'),
          resp.data.msgHtml
        );
      });
  }

  doSetFlag() {
    this.setFlagFormDisabled = true;
    this.Challenge
      .setFlag(this.challenge._id, this.challenge.flag)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.flag.successMsg'));
        this.challenge.flag = '';
        this.challenge.flagThumb = resp.data.flagThumb;
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.challenge.edit.flag.failMsg'),
          resp.data.msgHtml
        );
      })
      .then(() => this.setFlagFormDisabled = false);
  }

  doUpdate() {
    this.basicFormDisabled = true;
    this.Challenge
      .update(this.challenge._id, this.challenge)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.basic.successMsg'));
        this.$state.go('manage_challenge');
      })
      .catch(resp => {
        this.dialogs.error(
          this.$translate.instant('ui.page.manage.challenge.edit.basic.failMsg'),
          resp.data.msgHtml
        );
      })
      .then(() => this.setFlagFormDisabled = false);
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeEditController', Controller);
