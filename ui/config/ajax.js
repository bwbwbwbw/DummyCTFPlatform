export default function ajax ($httpProvider) {
  $httpProvider.interceptors.push('AjaxInjector');
}

ajax.$inject = ['$httpProvider'];
