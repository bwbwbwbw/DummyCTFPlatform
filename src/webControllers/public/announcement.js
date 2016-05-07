import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const announcementService = DI.get('announcementService');

  const router = Router();
  parentRouter.use(
    '/announcements',
    router
  );

  router.get('/',
    async (req, res) => {
      const announcements = await announcementService.getAnnouncements();
      res.json(announcements);
    }
  );

};
