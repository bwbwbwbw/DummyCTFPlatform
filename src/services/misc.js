import errorFactory from 'dg-error-factory';
import escapeHtml from 'escape-html';

export default (DI) => {

  global.UserError = errorFactory('UserError', function () {
    this.status = 400;
  });

  global.ValidationError = errorFactory('ValidationError', function (errorMsg) {
    this.status = 400;
    this.message = [
      'Invalid field: ',
      ...errorMsg.map(item => `- ${item.param}: ${item.msg}.`),
    ].join('\n');
    this.messageHtml = [
      '<p>Invalid field: </p>',
      '<ul>',
      ...errorMsg.map(item => `<li>${escapeHtml(item.param)}: ${escapeHtml(item.msg)}.</li>`),
      '</ul>',
    ].join('\n');
  });

  Date.prototype.toJSON = function () {
    return this.getTime();
  };

}
