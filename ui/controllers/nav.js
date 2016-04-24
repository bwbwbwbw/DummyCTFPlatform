let toastr, userService;

export default class RegisterController {
  constructor(_toastr, _userService) {
    toastr = _toastr;
    userService = _userService;
  }

  doLogout() {
    userService
      .logout()
      .then(resp => {
        toastr.success('You are logged out');
        setInterval(() => location.reload(), 1000);
      }, err => {
        toastr.error(`Logout failed: ${err.data.msg}`);
      });
  }
}

RegisterController.$inject = ['toastr', 'userService'];
