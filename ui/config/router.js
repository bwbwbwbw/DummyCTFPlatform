export default function router ($stateProvider) {
  $stateProvider
    .state('manage', {
      url: '/manage',
      templateUrl: '/static/angular-views/manage/index.html',
      controller: 'manageController as ctrl',
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

router.$inject = ['$stateProvider'];
