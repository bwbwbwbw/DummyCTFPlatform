import libObjectId from 'libs/objectId';
import i18n from 'i18n';
import _ from 'lodash';

export default (DI, eventBus, db) => {

  const Contest = db.Contest;
  const ContestRegistration = db.ContestRegistration;
  const ContestEvent = db.ContestEvent;

  const contestService = {};

  const updateFields = ['name', 'begin', 'end', 'regBegin', 'regEnd'];
  const updateProps = ['score', 'scoreDecrease', 'minScore'];

  /**
   * Create an contest event
   * @return {ContestEvent}
   */
  contestService.addEvent = async (contestId, content, args = {}) => {
    if (!libObjectId.isValid(id)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const event = new ContestEvent({
      published: false,
      createAt: new Date(),
      contest: contestId,
      content: content,
      args: args,
    });
    await event.save();
    return event;
  };

  /**
   * Set whether a contest event is published
   * @return {ContestEvent}
   */
  contestService.setEventPublishState = async (eventId, published = true) => {
    const event = await ContestEvent.findOne({ _id: eventId });
    if (event === null) {
      throw new UserError(i18n.__('error.contestEvent.notfound'));
    }
    event.published = published;
    event.updateAt = new Date();
    await event.save();
    return event;
  };

  /**
   * Get all contests
   * @return {[Contest]}
   */
  contestService.getContests = async () => {
    return await Contest.find({ deleted: false }).sort({ begin: -1 });
  };

  /**
   * Get a contest by its id
   * @return {Contest}
   */
  contestService.getContestObjectById = async (id, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(id)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.contest.notfound'));
      } else {
        return null;
      }
    }
    const contest = await Contest.findOne({ _id: id, deleted: false });
    if (contest === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    return contest;
  };

  /**
   * Validate the regBegin, regEnd, begin, end property of a contest
   */
  contestService.validateContestDate = (contest) => {
    if (contest.regBegin.getTime() >= contest.regEnd.getTime()) {
      throw new Error('error.contest.regBegin.greaterThanEnd');
    }
    if (contest.begin.getTime() >= contest.end.getTime()) {
      throw new Error('error.contest.begin.greaterThanEnd');
    }
    if (contest.begin.getTime() <= Date.now()) {
      throw new Error('error.contest.begin.lessThanNow');
    }
    if (contest.regEnd.getTime() >= contest.end.getTime()) {
      throw new Error('error.contest.regEnd.greaterThanEnd');
    }
  }

  /**
   * Create a contest with an empty challenge list
   * @return {Contest} The new contest object
   */
  contestService.createContest = async (props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const obj = {
      deleted: false,
      ..._.pick(props, updateFields)
    };
    const contest = new Contest(obj);
    contestService.validateContestDate(contest);
    await contest.save();
    return contest;
  };

  /**
   * Update contest properties
   * @return {Contest} The new contest object
   */
  contestService.updateContest = async (id, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const contest = await contestService.getContestObjectById(id);
    const updater = _.pick(props, updateFields);
    _.assign(contest, updater);
    contestService.validateContestDate(contest);
    await contest.save();
    return contest;
  };

  /**
   * Add a challenge to the contest
   * @return {Contest} The new contest object if updated successfully
   */
  contestService.contestAddChallenge = async (_id, _challengeId, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    if (!libObjectId.isValid(_id)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    if (!libObjectId.isValid(_challengeId)) {
      throw new UserError(i18n.__('error.challenge.notfound'));
    }
    const id = libObjectId.create(_id);
    const challengeId = libObjectId.create(_challengeId);
    return await Contest.findOneAndUpdate({
      '_id': id,
      'deleted': false,
      'challenges.id': { $ne: challengeId },
    }, {
      $push: {
        challenges: {
          id: challengeId,
          visible: false,
          ..._.pick(props, updateProps),
        }
      }
    }, {
      new: true,
    });
  };

  /**
   * Set the property of a challenge of a contest
   * @return {Contest} The new contest object if updated successfully
   */
  contestService.setContestChallengeProps = async (_id, _challengeId, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    if (!libObjectId.isValid(_id)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    if (!libObjectId.isValid(_challengeId)) {
      throw new UserError(i18n.__('error.challenge.notfound'));
    }
    const id = libObjectId.create(_id);
    const challengeId = libObjectId.create(_challengeId);
    const updater = _.mapKeys(
      _.pick(props, updateProps),
      (value, key) => `challenges.$.${key}`
    );
    return await Contest.findOneAndUpdate({
      '_id': id,
      'deleted': false,
      'challenges.id': challengeId,
    }, { $set: updater }, { new: true });
  };

  /**
   * Open or close a challenge to contesters
   * @return {Contest}
   */
  contestService.setChallengeVisibility = async (_id, _challengeId, visibility = true) => {
    if (!libObjectId.isValid(_id)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const id = libObjectId.create(_id);
    const challenge = DI.get('challengeService').getChallengeObjectById(_challengeId);
    const contest = await Contest.findOneAndUpdate({
      '_id': id,
      'deleted': false,
      'challenges.id': challenge._id,
    }, {
      $set: { 'challenges.$.visible': visibility === true }
    }, {
      new: true,
    });
    // no such contest
    // or no such challenge in contest
    if (contest === null) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    if (visibility === true) {
      eventBus.emit('contest.openChallenge', contest, challenge);
    }
    return contest;
  };

  /**
   * Whether a user has registered a contest
   * @return {Boolean}
   */
  contestService.isContestRegistered = async (id, userId) => {
    if (!libObjectId.isValid(id)) {
      return false;
    }
    if (!libObjectId.isValid(userId)) {
      return false;
    }
    const rec = await ContestRegistration.findOne({
      user: userId,
      contest: id,
    });
    return (rec !== null);
  };

  /**
   * Register a contest
   * @return {ContestRegistration}
   */
  contestService.registerContest = async (id, userId) => {
    if (!libObjectId.isValid(id)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    if (!libObjectId.isValid(userId)) {
      throw new UserError(i18n.__('error.user.notfound'));
    }
    const contest = contestService.getContestObjectById(id);
    if (Date.now() < contest.regBegin.getTime()) {
      throw new UserError(i18n.__('error.contest.registration.notReady'));
    }
    if (Date.now() >= contest.regEnd.getTime()) {
      throw new UserError(i18n.__('error.contest.registration.passed'));
    }
    const reg = new ContestRegistration({
      contest: id,
      user: userId,
      at: new Date(),
    });
    try {
      await reg.save();
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        // duplicate key error
        throw new UserError(i18n.__('error.contest.registration.registered'));
      } else {
        throw e;
      }
    }
    return reg;
  };

  contestService.checkBodyForCreateOrEdit = (req, res, next) => {
    updateFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  /**
   * Handle challenge update. When a challenge is updated
   * and it is part of an active contest, create an event
   */
  eventBus.on('challenge.update', async (challenge) => {
    const contests = await Contest.find({
      deleted: false,
      'challenges.id': challenge._id,
    });
    for (const contest of contests) {
      if (contest.getState() === 'ACTIVE') {
        contestService.addEvent(
          contest._id,
          'event.contest.challenge.updated',
          { name: challenge.name }
        );
      }
    }
  });

  /**
   * Handle challenge open. When a challenge is open
   * and it is part of an active contest, create an event
   */
  eventBus.on('contest.openChallenge', async (contest, challenge) => {
    if (contest.getState() === 'ACTIVE') {
      contestService.addEvent(
        contest._id,
        'event.contest.challenge.open',
        { name: challenge.name }
      );
    }
  });

  return contestService;

}
