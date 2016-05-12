import localeZH from 'locales/zh.json';

export default function translation ($translateProvider) {
  $translateProvider.translations('zh', localeZH);
  $translateProvider.preferredLanguage('zh');
  //$translateProvider.useSanitizeValueStrategy('escape');
}

translation.$inject = ['$translateProvider'];
