export default function xhr ($httpProvider) {
  $httpProvider.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest';
}

xhr.$inject = ['$httpProvider'];
