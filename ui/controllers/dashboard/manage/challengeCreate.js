let dialogs, toastr, $translate, Challenge, $state;

export default class ChallengeCreateController {
  constructor(_dialogs, _toastr, _$translate, _$state, _Challenge) {
    dialogs = _dialogs;
    toastr = _toastr;
    $translate = _$translate;
    $state = _$state;
    Challenge = _Challenge;

    this.basicFormDisabled = false;
    this.challenge = new Challenge({
      name: 'Unnamed Challenge',
      category: 'misc',
      difficulty: 0,
    });
  }

  doCreate() {
    this.basicFormDisabled = true;
    this.challenge
      .$save()
      .then(data => {
        toastr.success($translate.instant('ui.page.manage.challenge.create.successMsg'));
        $state.go('manage_challenge');
      })
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.challenge.create.failMsg'),
          err.data.msgHtml
        );
      })
      .then(() => this.basicFormDisabled = false);
  }
}

ChallengeCreateController.$inject = ['dialogs', 'toastr', '$translate', '$state', 'Challenge'];
