import libObjectId from 'libs/objectId';
import i18n from 'i18n';

export default (DI, eventBus, db) => {

  const Submission = db.Submission;

  const submissionService = {};

  /**
   * Add a submission record
   * @return {Submission}
   */
  submissionService.addSubmission = async (userId, ip, contestChallengeId, flag) => {
    if (!libObjectId.isValid(userId)) {
      throw new UserError(i18n.__('error.user.notfound'));
    }
    DI.get('oplogger').info('service.submission.add', {
      userId,
      ip,
      contestChallengeId,
      flag,
    });
    const contestService = DI.get('contestService');
    const _cc = await contestService.getContestChallengeObjectById(contestChallengeId);
    const cc = await _cc
      .populate('contest')
      .populate('challenge')
      .execPopulate();
    const isMatch = await cc.challenge.testFlag(flag);
    const submission = new Submission({
      user: userId,
      contest: cc.contest._id,
      challenge: cc.challenge._id,
      cc: cc._id,
      input: isMatch ? '[flag]' : flag,
      valid: isMatch,
      ip,
    });
    if (!isMatch) {
      await submission.save();
      return submission;
    }
    eventBus.emit('contest.submission.passed', contestChallengeId);
    // match: upsert
    return await Submission.findOneAndUpdate({
      user: userId,
      cc: cc._id,
      valid: true,
    }, {
      $setOnInsert: submission,
    }, {
      new: true,
      upsert: true,
    });
  };

  /**
   * Get succeeded submissions of a user
   * @return {[Submission]}
   */
  submissionService.getUserSuccessSubmissions = async (userId, contestId) => {
    if (!libObjectId.isValid(userId)) {
      throw new UserError(i18n.__('error.user.notfound'));
    }
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const submissions = await Submission.find({
      contest: contestId,
      valid: true,
      user: userId,
    });
    return submissions;
  };

  /**
   * Get succeeded submissions of a contest
   * @return {[Submission]}
   */
  submissionService.getContestSubmissions = async (contestId) => {
    if (!libObjectId.isValid(contestId)) {
      throw new UserError(i18n.__('error.contest.notfound'));
    }
    const submissions = await Submission.find({
      contest: contestId,
      valid: true,
    });
    return submissions;
  };

  submissionService.checkBodyForSubmitFlag = (req, res, next) => {
    req.checkBody('flag', i18n.__('error.validation.required')).notEmpty();
    next();
  };

  return submissionService;

};
