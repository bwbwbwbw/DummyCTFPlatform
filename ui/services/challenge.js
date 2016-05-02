import angular from 'angular';
import assign from 'lodash/assign';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  constructor(...args) {
    super(...args);
    assign(this, this.$resource(
      '/api/challenges/:id',
      { id: '@_id' },
      { update: { method: 'PUT'} }
    ));
  }

  setFlag(id, flag) {
    return this.$http.post(`/api/challenges/${id}/flag`, { flag });
  }
}

Service.$inject = ['$resource', '$http'];

angular
  .module('dummyctf.services')
  .service('Challenge', Service);
