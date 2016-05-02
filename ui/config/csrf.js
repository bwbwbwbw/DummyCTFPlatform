export default function csrf ($httpProvider) {
  $httpProvider.interceptors.push('CSRFInjector');
}

csrf.$inject = ['$httpProvider'];
