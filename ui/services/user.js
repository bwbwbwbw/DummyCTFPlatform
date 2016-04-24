import angular from 'angular';

let $http;

class UserService {
  constructor(_$http) {
    $http = _$http;
  }

  register(username, password) {
    return $http.post('/api/user/register', {
      username,
      password,
    });
  }

  signIn(username, password) {
    return $http.post('/api/user/signin', {
      username,
      password,
    });
  }

  logout() {
    return $http.post('/api/user/logout');
  }

}

UserService.$inject = ['$http'];

export default angular.module('dummyctf.services', [])
  .service('userService', UserService)
  .name;
