let toastr, User, $translate;

export default class RegisterController {
  constructor(_toastr, _User, _$translate) {
    toastr = _toastr;
    User = _User;
    $translate = _$translate;
  }

  doLogout() {
    User
      .logout()
      .then(resp => {
        location.reload();
      }, err => {
        toastr.error($translate.instant('ui.page.signout.successMsg', err.data));
      });
  }
}

RegisterController.$inject = ['toastr', 'User', '$translate'];
