let dialogs, toastr, userService;

export default class RegisterController {
  constructor(_dialogs, _toastr, _userService) {
    dialogs = _dialogs;
    toastr = _toastr;
    userService = _userService;
    this.formDisabled = false;
    this.username = '';
    this.password = '';
    this.password2 = '';
  }

  doRegister() {
    if (this.password !== this.password2) {
      dialogs.notify('Password mismatch', 'The two passwords you entered is not identical');
      return;
    }
    this.formDisabled = true;
    userService
      .register(this.username, this.password)
      .then(resp => {
        toastr.info('New user register successfully. You will be redirected soon.');
        setTimeout(() => window.location = '/', 3000);
      }, err => {
        dialogs.error('Register failed', err.data.msgHtml);
        this.formDisabled = false;
      });
  }
}

RegisterController.$inject = ['dialogs', 'toastr', 'userService'];
