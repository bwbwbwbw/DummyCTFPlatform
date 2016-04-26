let dialogs, toastr, $translate, Challenge;

export default class ChallengeListController {
  constructor(_dialogs, _toastr, _$translate, _Challenge) {
    dialogs = _dialogs;
    toastr = _toastr;
    $translate = _$translate;
    Challenge = _Challenge;

    this.challenges = Challenge.query();
    this.challenges.$promise
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.challenge.list.failMsg'),
          err.data.msgHtml
        );
      });
  }
}

ChallengeListController.$inject = ['dialogs', 'toastr', '$translate', 'Challenge'];
