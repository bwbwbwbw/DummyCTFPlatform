import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.Announcement
      .query()
      .then(resp => {
        this.announcements = resp.data;
      });
  }
}

Controller.$inject = ['dialogs', 'toastr', '$translate', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementListController', Controller);
