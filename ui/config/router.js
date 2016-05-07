export default function router ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/public/announcements');

  $stateProvider
    .state('public_announcement', {
      url: '/public/announcements',
      templateUrl: '/static/angular-views/public/announcement_list.html',
      controller: 'publicAnnouncementListController as ctrl',
    })
    .state('public_contest', {
      url: '/public/contests',
      templateUrl: '/static/angular-views/public/contest_list.html',
      controller: 'publicContestListController as ctrl',
    })
    .state('manage', {
      url: '/manage',
      templateUrl: '/static/angular-views/manage/index.html',
      controller: 'manageController as ctrl',
    })
    .state('manage_announcement', {
      url: '/manage/announcements',
      templateUrl: '/static/angular-views/manage/announcement_list.html',
      controller: 'manageAnnouncementListController as ctrl',
    })
    .state('manage_announcement_create', {
      url: '/manage/announcements/create',
      templateUrl: '/static/angular-views/manage/announcement_create.html',
      controller: 'manageAnnouncementCreateController as ctrl',
    })
    .state('manage_announcement_edit', {
      url: '/manage/announcements/:id/edit',
      templateUrl: '/static/angular-views/manage/announcement_edit.html',
      controller: 'manageAnnouncementEditController as ctrl',
    })
    .state('manage_challenge', {
      url: '/manage/challenges',
      templateUrl: '/static/angular-views/manage/challenge_list.html',
      controller: 'manageChallengeListController as ctrl',
    })
    .state('manage_challenge_create', {
      url: '/manage/challenges/create',
      templateUrl: '/static/angular-views/manage/challenge_create.html',
      controller: 'manageChallengeCreateController as ctrl',
    })
    .state('manage_challenge_edit', {
      url: '/manage/challenges/:id/edit',
      templateUrl: '/static/angular-views/manage/challenge_edit.html',
      controller: 'manageChallengeEditController as ctrl',
    })
    .state('manage_contest', {
      url: '/manage/contests',
      templateUrl: '/static/angular-views/manage/contest_list.html',
      controller: 'manageContestListController as ctrl',
    })
    .state('manage_contest_create', {
      url: '/manage/contests/create',
      templateUrl: '/static/angular-views/manage/contest_create.html',
      controller: 'manageContestCreateController as ctrl',
    })
    .state('manage_contest_info', {
      url: '/manage/contests/:id',
      templateUrl: '/static/angular-views/manage/contest_info.html',
      controller: 'manageContestInfoController as ctrl',
    })
    .state('manage_contest_challenge_add', {
      url: '/manage/contests/:id/challenge/add',
      templateUrl: '/static/angular-views/manage/contest_challenge_add.html',
      controller: 'manageContestChallengeAddController as ctrl',
    })
  ;
}

router.$inject = ['$urlRouterProvider', '$stateProvider'];
