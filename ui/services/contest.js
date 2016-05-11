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

  register(id, form) {
    return this.$http.post(`/public/contests/${id}/register`, form);
  }

  getAllChallenges(id) {
    return this.$http.get(`/api/contests/${id}/allChallenges`);
  }

  addChallenge(id, props) {
    return this.$http.put(`/api/contests/${id}/challenges`, props);
  }

  getChallenge(ccId) {
    return this.$http.get(`/api/contests/contestChallenge/${ccId}`);
  }

  updateChallenge(ccId, form) {
    return this.$http.put(`/api/contests/contestChallenge/${ccId}`, form);
  }

  setChallengeVisibility(ccId, visible) {
    return this.$http.post(`/api/contests/contestChallenge/${ccId}/visibility`, { visibility: visible });
  }

  getAvailableChallenges(id) {
    return this.$http.get(`/api/contests/${id}/availableChallenges`);
  }

  getAvailableValidators() {
    return this.$http.get('/api/contests/availableValidators');
  }

}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('Contest', Service);
