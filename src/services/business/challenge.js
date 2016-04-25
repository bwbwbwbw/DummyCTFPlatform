import bcrypt from 'bcrypt-as-promised';
import _ from 'lodash';

export default (DI, db) => {

  const Challenge = db.Challenge;

  const challengeService = {};

  /**
   * Get a list of all challenges
   * @return {[Challenge]} Challenge list
   */
  challengeService.getChallenges = async () => {
    return await Challenge.find().sort({ category: 1, name: 1 });
  };

  /**
   * Hash the flag and retrive the flag thumbnail
   * @return {Object} Containing {flag, flagThumb}
   */
  challengeService.makeFlagHashAndThumb = async (plainFlag) => {
    return {
      flag: await bcrypt.hash(plainFlag),
      flagThumb: plainFlag.substr(0, 3) + '...' + plainFlag.substr(-3, 3),
    };
  };

  challengeService.getChallengeObjectById = async (id, throwWhenNotFound = true) => {
    const challenge = await Challenge.findOne({ id });
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
    _.assign(obj, await challengeService.makeFlagHashAndThumb(obj.flag));
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
    const challenge = await getChallengeObjectById(id);
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
    const challenge = await getChallengeObjectById(id);
    _.assign(obj, await challengeService.makeFlagHashAndThumb(newFlag));
    await challenge.save();
    return challenge;
  };

  return challengeService;

}
