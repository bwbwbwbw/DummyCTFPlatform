import errorFactory from 'dg-error-factory';
import escapeHtml from 'escape-html';
import i18n from 'i18n';

export default (DI) => {

  global.UserError = errorFactory('UserError', function () {
    this.status = 400;
  });

  global.ValidationError = errorFactory('ValidationError', function (errorMsg) {
    this.status = 400;
    this.message = [
      `${i18n.__('error.validation.field')}: `,
      ...errorMsg.map(item => `- ${item.param}: ${item.msg}.`),
    ].join('\n');
    this.messageHtml = [
      `<p>${i18n.__('error.validation.field')}: </p>`,
      '<ul>',
      ...errorMsg.map(item => `<li>${escapeHtml(item.param)}: ${escapeHtml(item.msg)}.</li>`),
      '</ul>',
    ].join('\n');
  });

  Date.prototype.toJSON = function () {
    return this.getTime();
  };

}
