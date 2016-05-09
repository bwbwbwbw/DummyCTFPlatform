import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
}

Controller.$inject = ['announcements'];

angular
  .module('dummyctf.dashboard')
  .controller('manageAnnouncementListController', Controller);
