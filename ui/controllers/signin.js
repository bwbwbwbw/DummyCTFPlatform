let dialogs, toastr, userService;

export default class SignInController {
  constructor(_dialogs, _toastr, _userService) {
    dialogs = _dialogs;
    toastr = _toastr;
    userService = _userService;
    this.formDisabled = false;
    this.username = '';
    this.password = '';
  }

  doSignIn() {
    this.formDisabled = true;
    userService
      .signIn(this.username, this.password)
      .then(resp => {
        toastr.info('Sign in successfully. You will be redirected soon.');
        setTimeout(() => window.location = '/', 3000);
      }, err => {
        dialogs.error('Sign in failed', err.data.msgHtml);
        this.formDisabled = false;
      });
  }
}

SignInController.$inject = ['dialogs', 'toastr', 'userService'];
