import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {

  async doSetFlag() {
    const resp = await this.Challenge.setFlag(this.challenge._id, this.challenge.flag);
    this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.flag.successMsg'));
    this.challenge.flag = '';
    this.challenge.flagThumb = resp.data.flagThumb;
  }

  async doUpdate() {
    await this.Challenge.update(this.challenge._id, this.challenge);
    this.toastr.success(this.$translate.instant('ui.page.manage.challenge.edit.basic.successMsg'));
    this.$state.go('manage_challenge');
  }

}

Controller.$inject = ['challenge', 'toastr', '$translate', '$state', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeEditController', Controller);
