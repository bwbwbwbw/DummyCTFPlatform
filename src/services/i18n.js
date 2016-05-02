import i18n from 'i18n';

export default (DI) => {

  i18n.configure({
    directory: `${__projectRoot}/ui/locales`,
    objectNotation: true,
    autoReload: true,
    updateFiles: false,
    defaultLocale: 'zh',
  });

  return i18n;

};
