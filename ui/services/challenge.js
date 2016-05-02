import angular from 'angular';
import assign from 'lodash/assign';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  query() {
    return this.$http.get('/api/challenges');
  }

  get(id) {
    return this.$http.get(`/api/challenges/${id}`);
  }

  update(id, challenge) {
    return this.$http.put(`/api/challenges/${id}`, challenge);
  }

  setFlag(id, flag) {
    return this.$http.post(`/api/challenges/${id}/flag`, { flag });
  }
}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('Challenge', Service);
