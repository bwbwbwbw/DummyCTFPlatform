export default class csrfInjector {

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
