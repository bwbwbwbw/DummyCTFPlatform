/*global csrfToken */
import angular from 'angular';

export default class Service {
  request(config) {
    if (config.method === 'GET') {
      return config;
    }
    if (config.url !== '/' && !config.url.match(/^\/[^\/]/)) {
      return config;
    }
    config.headers['x-csrf-token'] = csrfToken;
    return config;
  }
}

angular
  .module('dummyctf.services')
  .service('CsrfInjector', Service);
