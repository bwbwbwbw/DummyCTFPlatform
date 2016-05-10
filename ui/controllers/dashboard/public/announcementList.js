import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
}

Controller.$inject = ['validateStatus', 'announcements'];

angular
  .module('dummyctf.dashboard')
  .controller('publicAnnouncementListController', Controller);
