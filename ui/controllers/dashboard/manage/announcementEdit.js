import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.loadAnnouncement();
  }

  async loadAnnouncement() {
    this.announcement = (await this.Announcement.get(this.$stateParams.id)).data;
    this.$rootScope.$apply();
  }

  async doUpdate() {
    await this.Announcement.update(this.announcement._id, this.announcement);
    this.toastr.success(this.$translate.instant('ui.page.manage.announcement.edit.successMsg'));
    this.$state.go('manage_announcement');
  }

}

Controller.$inject = ['toastr', '$translate', '$state', '$stateParams', '$rootScope', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementEditController', Controller);
