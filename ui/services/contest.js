import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  getCurrentContest() {
    return this.$http.get('/api/contests/current');
  }

  setCurrentContest(id) {
    return this.$http.put('/api/contests/current', { id });
  }

  query() {
    return this.$http.get('/api/contests');
  }

  queryPublic() {
    return this.$http.get('/public/contests');
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

  getAllChallenges(id) {
    return this.$http.get(`/api/contests/${id}/allChallenges`);
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
