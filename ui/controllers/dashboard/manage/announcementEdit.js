import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  load() {
    this.Announcement
      .get(this.$stateParams.id)
      .then(resp => {
        this.announcement = resp.data;
      });
  }

  doUpdate() {
    this.Announcement
      .update(this.announcement._id, this.announcement)
      .then(resp => {
        this.toastr.success(this.$translate.instant('ui.page.manage.announcement.edit.successMsg'));
        this.$state.go('manage_announcement');
      });
  }

}

Controller.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementEditController', Controller);
