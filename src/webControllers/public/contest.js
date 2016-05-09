import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';
import _ from 'lodash-joins';
import i18n from 'i18n';

export default (DI, parentRouter, app) => {

  const contestService = DI.get('contestService');
  const validator = DI.get('validator');

  const router = Router();
  parentRouter.use(
    '/contests',
    router
  );

  router.get('/',
    async (req, res) => {
      let result;
      const contests = await contestService.getContests();
      let registeredContests = [];
      if (req.session.user && req.session.user._id) {
        registeredContests = (await contestService.getRegisteredContests(req.session.user._id))
          .map(reg => {
            return { _id: reg.contest, registered: true };
          });
      }
      const accessor = (d) => String(d._id);
      result = contests.map(v => v.toObject());
      result = _.hashLeftOuterJoin(result, accessor, registeredContests, accessor);
      res.json(result.map(row => {
        if (row.registered === undefined) {
          row.registered = false;
        }
        return row;
      }));
    }
  );

  router.post('/:id/register',
    libRequestChecker.enforceRole(['CONTESTER']),
    async (req, res) => {
      // TODO: fix race condition here
      const isRegistered = await contestService.isContestRegistered(
        req.params.id,
        req.session.user._id
      );
      if (isRegistered) {
        throw new UserError(i18n.__('error.contest.registration.registered'));
      }

      const contest = await contestService.getContestObjectById(req.params.id);
      let regMeta = {
        validated: true,
      };
      let extraInfo = null;
      if (contest.validator) {
        const v = validator.get(contest.validator);
        if (v) {
          const r = v.doRegister(req.body);
          if (r) {
            if (r.type === 'form') {
              // request to show a form for user
              res.json({
                success: false,
                payload: r.payload,
              });
              return;
            } else if (r.type === 'pass') {
              // continue registeration
              regMeta = r.payload;
              extraInfo = r.extraInfo;
            } else {
              // invalid values
              throw new Error(`Unknown validator return type: ${r.type}`);
            }
          }
        }
      }
      const reg = await contestService.registerContest(
        req.params.id,
        req.session.user._id,
        regMeta
      );
      res.json({
        success: true,
        extraInfo,
        ...reg.toObject(),
      });
    }
  );

};
