import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
}

Controller.$inject = ['contest', 'contestChallenges'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestInfoController', Controller);
