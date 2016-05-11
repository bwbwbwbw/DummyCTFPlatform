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

  getProfile() {
    return this.$http.get('/public/user/profile');
  }

  updateProfile(profile) {
    return this.$http.post('/public/user/profile', profile);
  }

  updatePassword(form) {
    return this.$http.post('/public/user/password', form);
  }

  getValidationStatus() {
    return this.$http.get('/public/user/isValidated');
  }

  query() {
    return this.$http.get('/api/users');
  }

  resetPassword(id, password) {
    return this.$http.post(`/api/users/${id}/resetPassword`, { password });
  }

}

Service.$inject = ['$http'];

angular
  .module('dummyctf.services')
  .service('User', Service);
