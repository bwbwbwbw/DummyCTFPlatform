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

  doCreate() {
    this.Announcement
      .create(this.announcement)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.announcement.create.successMsg'));
        this.$state.go('manage_announcement');
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementCreateController', Controller);
