import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  async doUpdate() {
    await this.Announcement.update(this.announcement._id, this.announcement);
    this.toastr.success(this.$translate.instant('ui.page.manage.announcement.edit.successMsg'));
    this.$state.go('manage_announcement');
  }
}

Controller.$inject = ['announcement', 'toastr', '$translate', '$state', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementEditController', Controller);
