import errorFactory from 'dg-error-factory';

export default function (DI) {

  global.UserError = errorFactory('UserError', function () {
    this.status = 400;
  });

  global.ValidationError = errorFactory('ValidationError', function (msg) {
    this.status = 400;
    this.message = 'Invalid field: \n';
    for (const field in msg) {
      this.message += `- ${field}: ${msg[field].msg}.\n`
    }
  });

  Date.prototype.toJSON = function () {
    return this.getTime();
  };

}
