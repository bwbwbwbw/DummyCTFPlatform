import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  constructor(...args) {
    super(...args);
  }

  register(username, password) {
    return this.$http.post('/api/user/register', {
      username,
      password,
    });
  }

  signIn(username, password) {
    return this.$http.post('/api/user/signin', {
      username,
      password,
    });
  }

  logout() {
    return this.$http.post('/api/user/logout');
  }
}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('User', Service);
