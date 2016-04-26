import bcrypt from 'bcrypt-as-promised';
import randomstring from 'randomstring';
import i18n from 'i18n';
import _ from 'lodash';

export default (DI, db) => {

  const Challenge = db.Challenge;

  const challengeService = {};

  /**
   * Get a list of all challenges
   * @return {[Challenge]} Challenge list
   */
  challengeService.getChallenges = async () => {
    return await Challenge.find({}, {
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
    const challenge = await Challenge.findOne({ _id: id }, { flag: 0 });
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
    const obj = _.omit(props, ['_id', 'id']);
    _.assign(obj, await challengeService.makeFlagHashAndThumb(`ctf{${randomstring.generate()}}`));
    const challenge = new Challenge(obj);
    await challenge.save();
    return challenge;
  };

  /**
   * Update a challenge, except its flag
   * @return {Object} New challenge object
   */
  challengeService.updateChallenge = async (id, props) => {
    if (props !== Object(props)) {
      return null;
    }
    const challenge = await challengeService.getChallengeObjectById(id);
    const updater = _.omit(props, ['flag', 'flagThumb', '_id', 'id']);
    _.assign(challenge, updater);
    await challenge.save();
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
    req.checkBody({
      name: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
      },
      category: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
      },
      difficulty: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
      },
      description: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
      },
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
