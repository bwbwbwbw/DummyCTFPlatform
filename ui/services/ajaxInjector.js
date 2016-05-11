import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

function shouldProcess(url) {
  return url.indexOf('/api/') === 0 || url.indexOf('/public/') === 0;
}

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
    if (!shouldProcess(config.url)) {
      return config;
    }
    config.headers['x-requested-with'] = 'XMLHttpRequest';
    if (config.method !== 'GET') {
      this.addN(1);
    }
    return config;
  }

  response = (resp) => {
    if (!shouldProcess(resp.config.url)) {
      return resp;
    }
    if (resp.config.method !== 'GET') {
      this.addN(-1);
    }
    return resp;
  }

  responseError = (resp) => {
    if (!shouldProcess(resp.config.url)) {
      return resp;
    }
    let errBody;
    if (resp.data) {
      errBody = resp.data.msgHtml;
    } else {
      errBody = this.$injector.get('$translate').instant('ui.page.ajax.networkError');
    }
    this.$injector.get('dialogs').error(
      this.$injector.get('$translate').instant(`ui.page.ajax.${resp.config.method.toLowerCase()}FailMsg`),
      errBody
    );
    if (resp.config.method !== 'GET') {
      this.addN(-1);
    }
    return this.$q.reject(resp);
  }
}

Service.$inject = ['$q', '$injector'];

angular
  .module('dummyctf.services')
  .service('AjaxInjector', Service);
