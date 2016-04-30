let dialogs, toastr, $translate, Contest, $state;

export default class ContestCreateController {
  constructor(_dialogs, _toastr, _$translate, _$state, _Contest) {
    dialogs = _dialogs;
    toastr = _toastr;
    $translate = _$translate;
    $state = _$state;
    Contest = _Contest;

    this.basicFormDisabled = false;
    this.contest = new Contest({
      name: 'Unnamed Contest',
      regBegin: new Date(),
    });
  }

  doCreate() {
    this.basicFormDisabled = true;
    this.contest
      .$save()
      .then(data => {
        toastr.success($translate.instant('ui.page.manage.contest.create.successMsg'));
        $state.go('manage_contest');
      })
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.contest.create.failMsg'),
          err.data.msgHtml
        );
      })
      .then(() => this.basicFormDisabled = false);
  }
}

ContestCreateController.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Contest'];
