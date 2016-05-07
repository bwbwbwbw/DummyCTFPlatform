import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
  constructor(...args) {
    super(...args);
    this.Announcement
      .queryPublic()
      .then(resp => {
        this.announcements = resp.data;
      });
  }
}

Controller.$inject = ['Announcement'];

angular
  .module('dummyctf.dashboard')
  .controller('publicAnnouncementListController', Controller);
