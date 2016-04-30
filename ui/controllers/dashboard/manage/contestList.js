let dialogs, toastr, $translate, Contest;

export default class ContestListController {
  constructor(_dialogs, _toastr, _$translate, _Contest) {
    dialogs = _dialogs;
    toastr = _toastr;
    $translate = _$translate;
    Contest = _Contest;

    this.contests = Contest.query();
    this.contests.$promise
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.contest.list.failMsg'),
          err.data.msgHtml
        );
      });
  }
}

ContestListController.$inject = ['dialogs', 'toastr', '$translate', 'Contest'];
