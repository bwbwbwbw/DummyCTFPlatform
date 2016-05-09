import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.announcement = {
      title: 'New Announcement',
      content: '<p></p>',
    };
  }

  async doCreate() {
    await this.Announcement.create(this.announcement);
    this.toastr.success(this.$translate.instant('ui.page.manage.announcement.create.successMsg'));
    this.$state.go('manage_announcement');
  }
}

Controller.$inject = ['toastr', '$translate', '$state', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementCreateController', Controller);
