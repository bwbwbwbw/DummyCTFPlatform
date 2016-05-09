import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.load();
  }

  async load() {
    this.announcements = (await this.Announcement.queryPublic()).data;
    this.$rootScope.$apply();
  }
}

Controller.$inject = ['$rootScope', 'Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('publicAnnouncementListController', Controller);
