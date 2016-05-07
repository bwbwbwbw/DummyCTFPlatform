import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  query() {
    return this.$http.get('/api/challenges');
  }

  create(challenge) {
    return this.$http.post('/api/challenges', challenge);
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
