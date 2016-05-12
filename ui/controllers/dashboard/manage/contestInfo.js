import angular from 'angular';
import ServiceInjector from 'utils/ServiceInjector';

export default class Controller extends ServiceInjector {

  getPendingEventCount(events) {
    return events.filter(e => !e.processed).length;
  }

  async onPromptPublishEvent() {
    const form = (await this.dialogs.create(
      '/static/angular-views/manage/contest_event_publish.html',
      'manageContestEventPublishController',
      {},
      { size: 'md' },
      'ctrl'
    ).result);
    if (form && form.message && form.message.length > 0) {
      await this.Contest.addEvent(this.contest._id, form);
      this.toastr.success(this.$translate.instant('ui.page.manage.contest.info.eventAnnouncement.successMsg'));
      this.$state.reload();
    }
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
