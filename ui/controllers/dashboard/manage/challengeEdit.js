let dialogs, toastr, $translate, Challenge, $state, $stateParams;

export default class ChallengeEditController {
  constructor(_dialogs, _toastr, _$translate, _$state, _$stateParams, _Challenge) {
    dialogs = _dialogs;
    toastr = _toastr;
    $translate = _$translate;
    $state = _$state;
    $stateParams = _$stateParams;
    Challenge = _Challenge;

    this.setFlagFormDisabled = false;
    this.load();
  }

  load() {
    this.challenge = Challenge.get({ id: $stateParams.id });
    this.challenge.$promise
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.challenge.edit.load.failMsg'),
          err.data.msgHtml
        );
      });
  }

  doSetFlag() {
    this.setFlagFormDisabled = true;
    Challenge
      .setFlag(this.challenge._id, this.challenge.flag)
      .then(data => {
        toastr.success($translate.instant('ui.page.manage.challenge.edit.flag.successMsg'));
        this.challenge.flag = '';
        this.challenge.flagThumb = data.data.flagThumb;
      })
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.challenge.edit.flag.failMsg'),
          err.data.msgHtml
        );
      })
      .then(() => this.setFlagFormDisabled = false);
  }

  doUpdate() {
    this.basicFormDisabled = true;
    this.challenge
      .$update()
      .then(data => {
        toastr.success($translate.instant('ui.page.manage.challenge.edit.basic.successMsg'));
        $state.go('manage_challenge');
      })
      .catch(err => {
        dialogs.error(
          $translate.instant('ui.page.manage.challenge.edit.basic.failMsg'),
          err.data.msgHtml
        );
      })
      .then(() => this.setFlagFormDisabled = false);
  }

}

ChallengeEditController.$inject = ['dialogs', 'toastr', '$translate', '$state', '$stateParams', 'Challenge'];
