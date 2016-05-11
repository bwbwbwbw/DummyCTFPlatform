const resolveUserIsValidated = ['User', async (User) => {
  return (await User.getValidationStatus()).data;
}];
const resolveUserGetProfile = ['User', async (User) => {
  return (await User.getProfile()).data;
}];
const resolveAnnouncementQuery = ['Announcement', async (Announcement) => {
  return (await Announcement.query()).data;
}];
const resolveAnnouncementQueryPublic = ['Announcement', async (Announcement) => {
  return (await Announcement.queryPublic()).data;
}];
const resolveAnnouncementGet = ['Announcement', '$stateParams', async (Announcement, $stateParams) => {
  return (await Announcement.get($stateParams.id)).data;
}];
const resolveUserQuery = ['User', async (User) => {
  return (await User.query()).data;
}];
const resolveChallengeQuery = ['Challenge', async (Challenge) => {
  return (await Challenge.query()).data;
}];
const resolveChallengeGet = ['Challenge', '$stateParams', async (Challenge, $stateParams) => {
  return (await Challenge.get($stateParams.id)).data;
}];
const resolveContestQuery = ['Contest', async (Contest) => {
  return (await Contest.query()).data;
}];
const resolveContestQueryPublic = ['Contest', async (Contest) => {
  return (await Contest.queryPublic()).data;
}];
const resolveContestGet = ['Contest', '$stateParams', async (Contest, $stateParams) => {
  return (await Contest.get($stateParams.id)).data;
}];
const resolveContestGetChallenge = ['Contest', '$stateParams', async (Contest, $stateParams) => {
  return (await Contest.getChallenge($stateParams.cid)).data;
}];
const resolveContestAvailableValidators = ['Contest', async (Contest) => {
  return (await Contest.getAvailableValidators()).data;
}];
const resolveContestAvailableChallenges = ['Contest', '$stateParams', async (Contest, $stateParams) => {
  return (await Contest.getAvailableChallenges($stateParams.id)).data;
}];
const resolveContestGetAllChallenges = ['Contest', '$stateParams', async (Contest, $stateParams) => {
  return (await Contest.getAllChallenges($stateParams.id)).data;
}];
const resolveContestGetCurrentContest = ['Contest', async (Contest) => {
  return (await Contest.getCurrentContest()).data;
}];

export default function router ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/public/announcements');

  $stateProvider
    .state('user_profile', {
      url: '/user/profile',
      templateUrl: '/static/angular-views/user/profile.html',
      controller: 'userProfileController as ctrl',
      resolve: {
        user: resolveUserGetProfile,
      },
    })
    .state('public_announcement', {
      url: '/public/announcements',
      templateUrl: '/static/angular-views/public/announcement_list.html',
      controller: 'publicAnnouncementListController as ctrl',
      resolve: {
        announcements: resolveAnnouncementQueryPublic,
        validateStatus: resolveUserIsValidated,
      },
    })
    .state('public_contest', {
      url: '/public/contests',
      templateUrl: '/static/angular-views/public/contest_list.html',
      controller: 'publicContestListController as ctrl',
      resolve: {
        contests: resolveContestQueryPublic,
        validateStatus: resolveUserIsValidated,
      },
    })
    .state('manage', {
      url: '/manage',
      templateUrl: '/static/angular-views/manage/index.html',
      controller: 'manageController as ctrl',
    })
    .state('manage_user', {
      url: '/manage/users',
      templateUrl: '/static/angular-views/manage/user_list.html',
      controller: 'manageUserListController as ctrl',
      resolve: {
        users: resolveUserQuery,
      },
    })
    .state('manage_announcement', {
      url: '/manage/announcements',
      templateUrl: '/static/angular-views/manage/announcement_list.html',
      controller: 'manageAnnouncementListController as ctrl',
      resolve: {
        announcements: resolveAnnouncementQuery,
      },
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
      resolve: {
        announcement: resolveAnnouncementGet,
      },
    })
    .state('manage_challenge', {
      url: '/manage/challenges',
      templateUrl: '/static/angular-views/manage/challenge_list.html',
      controller: 'manageChallengeListController as ctrl',
      resolve: {
        challenges: resolveChallengeQuery,
      },
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
      resolve: {
        challenge: resolveChallengeGet,
      },
    })
    .state('manage_contest', {
      url: '/manage/contests',
      templateUrl: '/static/angular-views/manage/contest_list.html',
      controller: 'manageContestListController as ctrl',
      resolve: {
        contests: resolveContestQuery,
        currentContestId: resolveContestGetCurrentContest,
      },
    })
    .state('manage_contest_create', {
      url: '/manage/contests/create',
      templateUrl: '/static/angular-views/manage/contest_create.html',
      controller: 'manageContestCreateController as ctrl',
      resolve: {
        availableValidators: resolveContestAvailableValidators,
      },
    })
    .state('manage_contest_info', {
      url: '/manage/contests/:id',
      templateUrl: '/static/angular-views/manage/contest_info.html',
      controller: 'manageContestInfoController as ctrl',
      resolve: {
        contest: resolveContestGet,
        contestChallenges: resolveContestGetAllChallenges,
      },
    })
    .state('manage_contest_edit', {
      url: '/manage/contests/:id/edit',
      templateUrl: '/static/angular-views/manage/contest_edit.html',
      controller: 'manageContestEditController as ctrl',
      resolve: {
        contest: resolveContestGet,
        availableValidators: resolveContestAvailableValidators,
      },
    })
    .state('manage_contest_challenge_add', {
      url: '/manage/contests/:id/challenge/add',
      templateUrl: '/static/angular-views/manage/contest_challenge_add.html',
      controller: 'manageContestChallengeAddController as ctrl',
      resolve: {
        contest: resolveContestGet,
        availableChallenges: resolveContestAvailableChallenges,
      },
    })
    .state('manage_contest_challenge_view', {
      url: '/manage/contests/:id/challenge/:cid',
      templateUrl: '/static/angular-views/manage/contest_challenge_view.html',
      controller: 'manageContestChallengeViewController as ctrl',
      resolve: {
        cc: resolveContestGetChallenge,
      },
    })
    .state('manage_contest_challenge_edit', {
      url: '/manage/contests/:id/challenge/:cid/edit',
      templateUrl: '/static/angular-views/manage/contest_challenge_edit.html',
      controller: 'manageContestChallengeEditController as ctrl',
      resolve: {
        cc: resolveContestGetChallenge,
      },
    })
  ;
}

router.$inject = ['$urlRouterProvider', '$stateProvider'];
