import angular from 'angular';

let $http;

export default class User {
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

User.$inject = ['$http'];
