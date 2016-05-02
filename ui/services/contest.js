import angular from 'angular';
import assign from 'lodash/assign';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  constructor(...args) {
    super(...args);
    assign(this, this.$resource(
      '/api/contests/:id',
      { id: '@_id' },
      { update: { method: 'PUT'} }
    ));
  }

  getChallenges(id) {
    return this.$http.get(`/api/contests/${id}/challenges`);
  }
}

Service.$inject = ['$resource', '$http'];

angular
  .module('dummyctf.services')
  .service('Contest', Service);
