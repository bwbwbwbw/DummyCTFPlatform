import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.loadAnnouncements();
  }

  async loadAnnouncements() {
    this.announcements = (await this.Announcement.query()).data;
    this.$rootScope.$apply();
  }
}

Controller.$inject = ['$rootScope', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementListController', Controller);
