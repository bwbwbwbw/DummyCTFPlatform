import localeZH from 'locales/zh.json';

export default function translation ($translateProvider) {
  $translateProvider.translations('zh', localeZH);
  $translateProvider.preferredLanguage('zh');
}

translation.$inject = ['$translateProvider'];
