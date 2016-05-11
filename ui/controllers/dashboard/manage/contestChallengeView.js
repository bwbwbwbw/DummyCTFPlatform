import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {
}

Controller.$inject = ['cc'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestChallengeViewController', Controller);
