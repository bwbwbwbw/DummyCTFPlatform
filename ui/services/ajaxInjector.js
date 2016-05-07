import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Service extends ServiceInjector {

  constructor(...args) {
    super(...args);
    this.n = 0;
  }

  addN(inc) {
    const newN = this.n + inc;
    if (this.n === 0 && newN > 0) {
      this.activeElement = document.activeElement;
      angular.element('.ajax-layer').show().focus();
    } else if (this.n > 0 && newN === 0) {
      angular.element('.ajax-layer').hide();
      this.activeElement.focus();
      this.activeElement = null;
    }
    this.n = newN;
  }

  request = (config) => {
    if (config.url.indexOf('/api/') !== 0) {
      return config;
    }
    config.headers['x-requested-with'] = 'XMLHttpRequest';
    if (config.method !== 'GET') {
      this.addN(1);
    }
    return config;
  }

  response = (resp) => {
    if (resp.config.url.indexOf('/api/') !== 0) {
      return resp;
    }
    if (resp.config.method !== 'GET') {
      this.addN(-1);
    }
    return resp;
  }

  responseError = (resp) => {
    if (resp.config.url.indexOf('/api/') !== 0) {
      return resp;
    }
    this.$injector.get('dialogs').error(
      this.$injector.get('$translate').instant(`ui.page.ajax.${resp.config.method.toLowerCase()}FailMsg`),
      resp.data.msgHtml
    );
    if (resp.config.method !== 'GET') {
      this.addN(-1);
    }
    return resp;
  }
}

Service.$inject = ['$injector'];

angular
  .module('dummyctf.services')
  .service('AjaxInjector', Service);
