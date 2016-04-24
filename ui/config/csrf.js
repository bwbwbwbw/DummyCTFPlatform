export default function csrf ($httpProvider) {
  $httpProvider.defaults.headers.post['x-csrf-token'] = csrfToken;
};

csrf.$inject = ['$httpProvider'];
