import libObjectId from 'libs/objectId';
import i18n from 'i18n';
import _ from 'lodash';

export default (DI, eventBus, db) => {

  const Announcement = db.Announcement;

  const announcementService = {};

  const updateFields = ['title', 'content'];

  /**
   * Get a list of all announcements
   * @return {[Announcement]} Announcement list
   */
  announcementService.getAnnouncements = async () => {
    return await Announcement.find({ deleted: false }).sort({ createdAt: 1 });
  };

  /**
   * Get a announcement by its id
   * @return {Announcement}
   */
  announcementService.getAnnouncementObjectById = async (id, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(id)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.announcement.notfound'));
      } else {
        return null;
      }
    }
    const announcement = await Announcement.findOne({ _id: id, deleted: false });
    if (announcement === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.announcement.notfound'));
    }
    return announcement;
  };

  /**
   * Create a new announcement
   * @return {Announcement}
   */
  announcementService.createAnnouncement = async (props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const obj = {
      deleted: false,
      ..._.pick(props, updateFields),
    };
    const announcement = new Announcement(obj);
    await announcement.save();
    return announcement;
  }

  /**
   * Update an announcement
   * @return {Announcement} New announcement object
   */
  announcementService.updateAnnouncement = async (id, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const announcement = await announcementService.getAnnouncementObjectById(id);
    const updater = _.pick(props, updateFields);
    _.assign(announcement, updater);
    await announcement.save();
    return announcement;
  };

  announcementService.checkBodyForCreateOrEdit = (req, res, next) => {
    updateFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  return announcementService;

};
