import libRequestChecker from 'libs/requestChecker';
import Router from 'express-promise-router';

export default (DI, parentRouter, app) => {

  const announcementService = DI.get('announcementService');

  const router = Router();
  parentRouter.use(
    '/announcements',
    libRequestChecker.enforceRole(['ADMIN']),
    router
  );

  router.get('/',
    async (req, res) => {
      const announcements = await announcementService.getAnnouncements();
      res.json(announcements);
    }
  );

  router.post('/',
    announcementService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const announcement = await announcementService.createAnnouncement(req.body);
      res.json(announcement);
    }
  );

  router.get('/:id',
    async (req, res) => {
      const announcement = await announcementService.getAnnouncementObjectById(req.params.id);
      res.json(announcement);
    }
  );

  router.put('/:id',
    announcementService.checkBodyForCreateOrEdit,
    libRequestChecker.raiseValidationErrors,
    async (req, res) => {
      const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
      res.json(announcement);
    }
  );

};
