import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const systemPropertyService = DI.get('systemPropertyService');
  const contestService = DI.get('contestService');

  const router = Router();
  parentRouter.use('/', router);

  router.get('/',
    async (req, res) => {
      let contest = null;
      const contestId = await systemPropertyService.get('current_contest', null);
      if (contestId !== null) {
        contest = await contestService.getContestObjectById(contestId, false);
      }
      res.render('dashboard', { currentContest: contest });
    }
  );

};
