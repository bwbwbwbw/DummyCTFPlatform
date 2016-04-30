import libObjectId from 'libs/objectId';
import bcrypt from 'bcrypt-as-promised';
import randomstring from 'randomstring';
import i18n from 'i18n';
import _ from 'lodash';

export default (DI, eventBus, db) => {

  const Challenge = db.Challenge;

  const challengeService = {};

  const updateFields = ['name', 'category', 'difficulty', 'description'];

  /**
   * Get a list of all challenges
   * @return {[Challenge]} Challenge list
   */
  challengeService.getChallenges = async () => {
    return await Challenge.find({ deleted: false }, {
      flag: 0,
      description: 0
    }).sort({ category: 1, name: 1 });
  };

  /**
   * Hash the flag and retrive the flag thumbnail
   * @return {Object} Containing {flag, flagThumb}
   */
  challengeService.makeFlagHashAndThumb = async (plainFlag) => {
    let flagThumb;
    if (plainFlag.length > 10) {
      flagThumb = plainFlag.substr(0, 6) + '...' + plainFlag.substr(-4, 4);
    } else {
      flagThumb = plainFlag.substr(0, 3) + '...';
    }
    return {
      flag: await bcrypt.hash(plainFlag),
      flagThumb,
    };
  };

  /**
   * Get the challenge object by its id
   * @return {Challange} The challenge object
   */
  challengeService.getChallengeObjectById = async (id, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(id)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.challenge.notfound'));
      } else {
        return null;
      }
    }
    const challenge = await Challenge.findOne({ _id: id, deleted: false }, { flag: 0 });
    if (challenge === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.challenge.notfound'));
    }
    return challenge;
  };

  /**
   * Create a new challenge. Notice that the HTML will not be filtered here.
   * @param  {Object} props Challenge object
   * @return {Object} New challenge object
   */
  challengeService.createChallenge = async (props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const obj = {
      deleted: false,
      ..._.pick(props, updateFields),
    };
    _.assign(obj, await challengeService.makeFlagHashAndThumb(`ctf{${randomstring.generate()}}`));
    const challenge = new Challenge(obj);
    await challenge.save();
    eventBus.emit('challenge.create', challenge);
    return challenge;
  };

  /**
   * Update a challenge, except its flag
   * @return {Object} New challenge object
   */
  challengeService.updateChallenge = async (id, props) => {
    if (props !== Object(props)) {
      throw new Error('Expect parameter "props" to be an object');
    }
    const challenge = await challengeService.getChallengeObjectById(id);
    const updater = _.pick(props, updateFields);
    _.assign(challenge, updater);
    await challenge.save();
    eventBus.emit('challenge.update', challenge);
    return challenge;
  };

  /**
   * Update the flag of a challenge
   * @return {Object} New challenge object
   */
  challengeService.updateChallengeFlag = async (id, newFlag) => {
    const challenge = await challengeService.getChallengeObjectById(id);
    _.assign(challenge, await challengeService.makeFlagHashAndThumb(newFlag));
    await challenge.save();
    return challenge;
  };

  challengeService.checkBodyForCreateOrEdit = (req, res, next) => {
    updateFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  challengeService.checkBodyForSetFlag = (req, res, next) => {
    req.checkBody({
      flag: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
      },
    });
    next();
  };

  return challengeService;

}
