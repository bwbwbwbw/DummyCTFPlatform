let toastr, userService, $translate;

export default class RegisterController {
  constructor(_toastr, _userService, _$translate) {
    toastr = _toastr;
    userService = _userService;
    $translate = _$translate;
  }

  doLogout() {
    userService
      .logout()
      .then(resp => {
        location.reload();
      }, err => {
        toastr.error($translate.instant('ui.page.signout.successMsg', err.data));
      });
  }
}

RegisterController.$inject = ['toastr', 'userService', '$translate'];
