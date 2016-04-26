let dialogs, toastr, User, $translate;

export default class SignInController {
  constructor(_dialogs, _toastr, _User, _$translate) {
    dialogs = _dialogs;
    toastr = _toastr;
    User = _User;
    $translate = _$translate;

    this.formDisabled = false;
    this.username = '';
    this.password = '';
  }

  doSignIn() {
    this.formDisabled = true;
    User
      .signIn(this.username, this.password)
      .then(resp => {
        window.location = '/';
      }, err => {
        dialogs.error(
          $translate.instant('ui.page.signin.failMsg'),
          err.data.msgHtml
        );
        this.formDisabled = false;
      });
  }
}

SignInController.$inject = ['dialogs', 'toastr', 'User', '$translate'];
