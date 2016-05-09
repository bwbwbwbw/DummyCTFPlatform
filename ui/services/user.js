import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {
  register(username, password) {
    return this.$http.post('/public/user/register', {
      username,
      password,
    });
  }

  signIn(username, password) {
    return this.$http.post('/public/user/signin', {
      username,
      password,
    });
  }

  logout() {
    return this.$http.post('/public/user/logout');
  }
}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('User', Service);
