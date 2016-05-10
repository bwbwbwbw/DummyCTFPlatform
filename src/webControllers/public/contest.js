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
            return { _id: reg.contest, register: reg };
          });
      }
      const accessor = (d) => String(d._id);
      result = contests.map(v => v.toObject());
      result = _.hashLeftOuterJoin(result, accessor, registeredContests, accessor);
      res.json(result);
    }
  );

  router.post('/:id/register',
    libRequestChecker.enforceRole(['CONTESTER']),
    async (req, res) => {
      const prevReg = await contestService.getContestRegistration(
        req.params.id,
        req.session.user._id
      );

      const contest = await contestService.getContestObjectById(req.params.id);
      const v = validator.get(contest.validator);
      const resultBeforeReg = await v.beforeRegister(req, prevReg);
      if (resultBeforeReg !== undefined && resultBeforeReg !== null) {
        res.json({
          success: false,
          payload: resultBeforeReg,
        });
        return;
      }

      let reg;
      if (prevReg) {
        reg = prevReg;
      } else {
        reg = await contestService.registerContest(
          req.params.id,
          req.session.user._id
        );
      }

      const resultAfterReg = await v.afterRegister(req, String(reg._id), prevReg);
      res.json({
        success: true,
        extraInfo: resultAfterReg,
        ...reg.toObject(),
      });
    }
  );

};
