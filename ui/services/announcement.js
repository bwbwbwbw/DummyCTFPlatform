import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  query() {
    return this.$http.get('/api/announcements');
  }

  create(announcement) {
    return this.$http.post('/api/announcements', announcement);
  }

  get(id) {
    return this.$http.get(`/api/announcements/${id}`);
  }

  update(id, announcement) {
    return this.$http.put(`/api/announcements/${id}`, announcement);
  }

}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('Announcement', Service);
