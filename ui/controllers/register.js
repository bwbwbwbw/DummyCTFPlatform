let dialogs, toastr, userService, $translate;

export default class RegisterController {
  constructor(_dialogs, _toastr, _userService, _$translate) {
    dialogs = _dialogs;
    toastr = _toastr;
    userService = _userService;
    $translate = _$translate;
    this.formDisabled = false;
    this.username = '';
    this.password = '';
    this.password2 = '';
  }

  doRegister() {
    if (this.password !== this.password2) {
      dialogs.error(
        $translate.instant('ui.page.register.failMsg'),
        $translate.instant('ui.page.register.retypeNotMatchMsg')
      );
      return;
    }
    this.formDisabled = true;
    userService
      .register(this.username, this.password)
      .then(resp => {
        window.location = '/';
      }, err => {
        dialogs.error(
          $translate.instant('ui.page.register.failMsg'),
          err.data.msgHtml
        );
        this.formDisabled = false;
      });
  }
}

RegisterController.$inject = ['dialogs', 'toastr', 'userService', '$translate'];
