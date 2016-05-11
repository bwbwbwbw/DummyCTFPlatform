import libObjectId from 'libs/objectId';
import i18n from 'i18n';
import _ from 'lodash';

export default (DI, eventBus, db) => {

  const Contest = db.Contest;
  const ContestChallenge = db.ContestChallenge;
  const ContestEvent = db.ContestEvent;
  const ContestRegistration = db.ContestRegistration;

  const contestService = {};

  const updateFields = ['name', 'begin', 'end', 'regBegin', 'regEnd', 'validator'];
  const updateChallengeFields = ['score', 'scoreDecrease', 'minScore'];

  /**
   * Create an contest event
   * @return {ContestEvent}
   */
  contestService.addEvent = async (contestId, content, args = {}) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const event = new ContestEvent({
      published: false,
      processed: false,
      contest: contestId,
      content,
      args,
    });
    await event.save();
    return event;
  };

  /**
   * Set whether a contest event is published
   * @return {ContestEvent}
   */
  contestService.setEventPublishState = async (eventId, published = true) => {
    if (!libObjectId.isValid(eventId)) {
      throw new UserError(i18n.__('error.contestEvent.notfound'));
    }
    const event = await ContestEvent.findOne({ _id: eventId });
    if (event === null) {
      throw new UserError(i18n.__('error.contestEvent.notfound'));
    }
    event.published = published;
    event.processed = true;
    await event.save();
    return event;
  };

  /**
   * Get events of a contest
   * @return {[ContestEvent]}
   */
  contestService.getEvents = async (contestId, filterNotPublished = true) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const findExp = { contest: contestId };
    if (filterNotPublished) {
      findExp.published = true;
    }
    const events = await ContestEvent.find(findExp).sort({ updatedAt: -1 });
    return events;
  };

  /**
   * Retrive the count of challenges group by each contest
   */
  contestService.groupContestChallengeCount = async () => {
    return await ContestChallenge.aggregate([{
      $group: {
        _id: '$contest',
        challengeCount: {$sum: 1},
      },
    }]).exec();
  };

  /**
   * Retrive the count of registrants group by each contest
   */
  contestService.groupContestRegistrantCount = async () => {
    return await ContestRegistration.aggregate([{
      $group: {
        _id: '$contest',
        registrantCount: {$sum: 1},
      },
    }]).exec();
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
  contestService.getContestObjectById = async (contestId, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(contestId)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.contest.notfound'));
      } else {
        return null;
      }
    }
    const contest = await Contest.findOne({ _id: contestId, deleted: false });
    if (contest === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    return contest;
  };

  /**
   * Get a contest challenge by its id
   * @return {ContestChallenge}
   */
  contestService.getContestChallengeObjectById = async (contestChallengeId, throwWhenNotFound = true, populate = false) => {
    if (!libObjectId.isValid(contestChallengeId)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.contest.challenge.notfound'));
      } else {
        return null;
      }
    }
    let p = ContestChallenge.findOne({ _id: contestChallengeId });
    if (populate) {
      p = p.populate('contest').populate('challenge', { flag: 0 });
    }
    const cc = await p;
    if (cc === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.contest.challenge.notfound'));
    }
    return cc;
  };

  /**
   * Get a contest registration by its id
   * @return {ContestRegistration}
   */
  contestService.getContestRegistrationObjectById = async (contestRegistrationId, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(contestRegistrationId)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.contest.registration.notfound'));
      } else {
        return null;
      }
    }
    const cr = await ContestRegistration.findOne({ _id: contestRegistrationId });
    if (cr === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.contest.registration.notfound'));
    }
    return cr;
  };

  /**
   * Validate the regBegin, regEnd, begin, end property of a contest
   */
  contestService.validateContestDate = (contest) => {
    if (contest.regBegin.getTime() >= contest.regEnd.getTime()) {
      throw new UserError(i18n.__('error.contest.regBegin.greaterThanEnd'));
    }
    if (contest.begin.getTime() >= contest.end.getTime()) {
      throw new UserError(i18n.__('error.contest.begin.greaterThanEnd'));
    }
    if (contest.regEnd.getTime() >= contest.end.getTime()) {
      throw new UserError(i18n.__('error.contest.regEnd.greaterThanEnd'));
    }
  };

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
      ..._.pick(props, updateFields),
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
  contestService.updateContest = async (contestId, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const contest = await contestService.getContestObjectById(contestId);
    const updater = _.pick(props, updateFields);
    _.assign(contest, updater);
    contestService.validateContestDate(contest);
    await contest.save();
    return contest;
  };

  /**
   * Add a challenge to the contest
   * @return {ContestChallenge}
   */
  contestService.addChallenge = async (contestId, challengeId, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    // check existance and deletion
    const contest = await contestService.getContestObjectById(contestId);
    const challenge = await DI.get('challengeService').getChallengeObjectById(challengeId);
    const contestChallenge = new ContestChallenge({
      contest: contest._id,
      challenge: challenge._id,
      visible: false,
      ..._.pick(props, updateChallengeFields),
    });
    try {
      await contestChallenge.save();
    } catch(e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        // duplicate key error
        throw new UserError(i18n.__('error.contest.challenge.exist'));
      } else {
        throw e;
      }
    }
    return contestChallenge;
  };

  /**
   * Set the property of a challenge of a contest
   * @return {ContestChallenge}
   */
  contestService.setChallengeProps = async (contestChallengeId, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const contestChallenge = await contestService.getContestChallengeObjectById(contestChallengeId);
    const updater = _.pick(props, updateChallengeFields);
    _.assign(contestChallenge, updater);
    await contestChallenge.save();
    return contestChallenge;
  };

  /**
   * Open or close a challenge to contesters
   * @return {ContestChallenge}
   */
  contestService.setChallengeVisibility = async (contestChallengeId, visibility = true) => {
    const contestChallenge = await contestService.getContestChallengeObjectById(contestChallengeId);
    const emitEvent = (contestChallenge.visible !== true && visibility === true);
    contestChallenge.visible = (visibility === true);
    await contestChallenge.save();
    if (emitEvent) {
      eventBus.emit('contest.challenge.open', contestChallenge);
    }
    return contestChallenge;
  };

  /**
   * Get all challenges of a contest, includes challenge flagThumb
   * @return {[ContestChallenge]}
   */
  contestService.getAllChallenges = async (contestId) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const contestChallenges = await ContestChallenge
      .find({ contest: contestId })
      .sort({ updatedAt: -1 })
      .populate('challenge', { name: 1, category: 1, difficulty: 1, flagThumb: 1 });
    return contestChallenges;
  };

  /**
   * Get visible challenges of a contest
   * @return {[ContestChallenge]}
   */
  contestService.getVisibleChallenges = async (contestId) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const contestChallenges = await ContestChallenge
      .find({ contest: contestId, visible: true })
      .sort({ updatedAt: -1 })
      .populate('challenge', { name: 1, category: 1, difficulty: 1 });
    return contestChallenges;
  };

  /**
   * Get a list of contest that a user has registered
   * @return {[ContestRegistration]}
   */
  contestService.getRegisteredContests = async (userId) => {
    if (!libObjectId.isValid(userId)) {
      return false;
    }
    return await ContestRegistration.find({ user: userId });
  };

  /**
   * Whether a user has registered a contest
   * @return {ContestRegistration|null}
   */
  contestService.getContestRegistration = async (contestId, userId) => {
    if (!libObjectId.isValid(contestId)) {
      return null;
    }
    if (!libObjectId.isValid(userId)) {
      return null;
    }
    return await ContestRegistration.findOne({
      user: userId,
      contest: contestId,
    });
  };

  /**
   * Register a contest
   * @return {ContestRegistration}
   */
  contestService.registerContest = async (contestId, userId) => {
    if (!libObjectId.isValid(userId)) {
      throw new UserError(i18n.__('error.user.notfound'));
    }
    const contest = await contestService.getContestObjectById(contestId);
    const now = Date.now();
    if (now < contest.regBegin.getTime()) {
      throw new UserError(i18n.__('error.contest.registration.notReady'));
    }
    if (now >= contest.regEnd.getTime()) {
      throw new UserError(i18n.__('error.contest.registration.passed'));
    }
    const reg = new ContestRegistration({
      contest: contestId,
      user: userId,
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

  /**
   * Update the meta data of a contest registration
   */
  contestService.updateRegistrationMeta = async (regId, metaData) => {
    const reg = await contestService.getContestRegistrationObjectById(regId);
    reg.meta = metaData;
    reg.markModified('meta');
    await reg.save();
    return reg;
  };

  /**
   * Get all registrants of a contest
   * @return {[User]}
   */
  contestService.getRegistrants = async (contestId) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const registrants = await ContestRegistration
      .find({ contest: contestId })
      .sort({ createdAt: -1 })
      .populate('user', { username: 1, profile: 1 });
    return registrants;
  };

  contestService.checkBodyForCreateOrEdit = (req, res, next) => {
    updateFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  contestService.checkBodyForAddChallenge = (req, res, next) => {
    req.checkBody('challenge', i18n.__('error.validation.required')).notEmpty();
    updateChallengeFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  contestService.checkBodyForEditChallenge = (req, res, next) => {
    updateChallengeFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  contestService.checkBodyForSetVisibility = (req, res, next) => {
    req.checkBody('visibility', i18n.__('error.validation.required')).notEmpty();
    next();
  };

  /**
   * Handle challenge update. When a challenge is updated
   * and it is part of an active contest, create an event
   */
  eventBus.on('challenge.description.update', async (challenge) => {
    const contestChallenges = await ContestChallenge
      .find({
        challenge: challenge._id,
        visible: true,
      })
      .populate('contest');
    for (const cc of contestChallenges) {
      if (!cc.contest.deleted && cc.contest.state === 'ACTIVE') {
        contestService.addEvent(
          cc.contest._id,
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
  eventBus.on('contest.challenge.open', async (contestChallenge) => {
    contestChallenge = await contestChallenge
      .populate('contest')
      .populate('challenge')
      .execPopulate();
    if (
      contestChallenge.contest.deleted
      || contestChallenge.challenge.deleted
    ) {
      return;
    }
    if (contestChallenge.contest.state === 'ACTIVE') {
      contestService.addEvent(
        contestChallenge.contest._id,
        'event.contest.challenge.open',
        { name: contestChallenge.challenge.name }
      );
    }
  });

  return contestService;

};
