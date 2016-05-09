import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  async load() {
    this.challenge = (await this.Challenge.get(this.$stateParams.id)).data;
    this.$rootScope.$apply();
  }

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

Controller.$inject = ['toastr', '$translate', '$state', '$stateParams', '$rootScope', 'Challenge'];

angular
  .module('dummyctf.dashboard')
  .controller('manageChallengeEditController', Controller);
