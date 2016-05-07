import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import _ from 'lodash-joins';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');

  const router = Router();
  parentRouter.use(
    '/contests',
    router
  );

  router.get('/',
    async (req, res) => {
      let result;
      const contests = await contestService.getContests();
      const contestRegistrantCount = await contestService.groupContestRegistrantCount();
      let registeredContests = [];
      if (req.session.user && req.session.user._id) {
        registeredContests = (await contestService.getRegisteredContests(req.session.user._id))
          .map(reg => {
            return { _id: reg.contest, registered: true }
          });
      }
      const accessor = (d) => String(d._id);
      result = contests.map(v => v.toObject());
      result = _.hashLeftOuterJoin(result, accessor, contestRegistrantCount, accessor);
      result = _.hashLeftOuterJoin(result, accessor, registeredContests, accessor);
      res.json(result.map(row => {
        if (row.registered === undefined) {
          row.registered = false;
        }
        if (row.registrantCount === undefined) {
          row.registrantCount = 0;
        }
        return row;
      }));
    }
  );

};
