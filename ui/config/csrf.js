export default function csrf ($httpProvider) {
  $httpProvider.interceptors.push('CsrfInjector');
}

csrf.$inject = ['$httpProvider'];
