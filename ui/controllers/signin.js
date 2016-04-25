let dialogs, toastr, userService, $translate;

export default class SignInController {
  constructor(_dialogs, _toastr, _userService, _$translate) {
    dialogs = _dialogs;
    toastr = _toastr;
    userService = _userService;
    $translate = _$translate;
    this.formDisabled = false;
    this.username = '';
    this.password = '';
  }

  doSignIn() {
    this.formDisabled = true;
    userService
      .signIn(this.username, this.password)
      .then(resp => {
        toastr.info($translate.instant('ui.page.signin.successMsg'));
        setTimeout(() => window.location = '/', 3000);
      }, err => {
        dialogs.error(
          $translate.instant('ui.page.signin.failMsg'),
          err.data.msgHtml
        );
        this.formDisabled = false;
      });
  }
}

SignInController.$inject = ['dialogs', 'toastr', 'userService', '$translate'];
