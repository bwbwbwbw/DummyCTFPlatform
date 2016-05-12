import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {

  getPendingEventCount(events) {
    return events.filter(e => !e.processed).length;
  }

  async onSetPublish(event, isPublished) {
    const op = (isPublished) ? 'publish' : 'unpublish';
    try {
      await (this.dialogs.confirm(
        'Confirm',
        `Are you sure want to set publish state to: ${isPublished}?`
      ).result);
    } catch (ignore) {
      // rejected
      return;
    }
    await this.Contest.setEventPublishState(event._id, isPublished);
    this.toastr.success(this.$translate.instant(`ui.page.manage.contest.info.eventPublish.successMsg.${op}`));
    this.$state.reload();
  }
}

Controller.$inject = ['contest', 'contestChallenges', 'contestEvents', 'dialogs', '$translate', 'Contest', 'toastr', '$state'];

angular
  .module('dummyctf.dashboard')
  .controller('manageContestInfoController', Controller);
