import angular from 'angular';
import assign from 'lodash/assign';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  query() {
    return this.$http.get('/api/contests');
  }

  create(contest) {
    return this.$http.post('/api/contests', contest);
  }

  get(id) {
    return this.$http.get(`/api/contests/${id}`);
  }

  update(id, contest) {
    return this.$http.put(`/api/contests/${id}`, contest);
  }

  getChallenges(id) {
    return this.$http.get(`/api/contests/${id}/challenges`);
  }

  addChallenge(id, props) {
    return this.$http.put(`/api/contests/${id}/challenges`, props);
  }

  getAvailableChallenges(id) {
    return this.$http.get(`/api/contests/${id}/availableChallenges`);
  }

}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('Contest', Service);
