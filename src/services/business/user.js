import libObjectId from 'libs/objectId';
import bcrypt from 'bcrypt-as-promised';
import i18n from 'i18n';

export default (DI, eventBus, db) => {

  const User = db.User;

  const userService = {};

  const updateProfileFields = ['nickname', 'name', 'stdid', 'department', 'grade', 'phone', 'email'];

  /**
   * Normalize the username
   * @return {String} normalized username
   */
  userService.normalizeUserNameSync = (username) => {
    return String(username).toLowerCase().trim();
  };

  /**
   * Get user object by username
   * @return {User} The user object
   */
  userService.getUserObjectByUsername = async (username, throwWhenNotFound = true) => {
    const usernameNormalized = userService.normalizeUserNameSync(username);
    const user = await User.findOne({ username_std: usernameNormalized, deleted: false });
    if (user === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.username.notfound'));
    }
    return user;
  };

  /**
   * Get user object by id
   * @return {User} The mongoose user object
   */
  userService.getUserObjectById = async (id, throwWhenNotFound = true) => {
    if (!libObjectId.isValid(id)) {
      if (throwWhenNotFound) {
        throw new UserError(i18n.__('error.username.notfound'));
      } else {
        return null;
      }
    }
    const user = await User.findOne({ _id: id, deleted: false });
    if (user === null && throwWhenNotFound) {
      throw new UserError(i18n.__('error.username.notfound'));
    }
    return user;
  };

  /**
   * Get all users
   * @return {[User]}
   */
  userService.getUsers = async () => {
    return await User.find({ deleted: false }, { hash: 0 }).sort({ _id: -1 });
  };

  /**
   * Insert a new user into the database
   * @return {User} New user object
   */
  userService.createUser = async (username, password, roles) => {
    if (await userService.getUserObjectByUsername(username, false) !== null) {
      throw new UserError(i18n.__('error.username.taken'));
    }
    const newUser = new User({
      username,
      username_std: userService.normalizeUserNameSync(username),
      hash: await bcrypt.hash(password, 10),
      roles,
      disabled: false,
      validated: false,
      deleted: false,
      profile: {
        nickname: username,
      },
    });
    try {
      await newUser.save();
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        // duplicate key error
        throw new UserError(i18n.__('error.username.taken'));
      } else {
        throw e;
      }
    }
    return newUser;
  };

  /**
   * Retrive a user object and test credential
   * @return {User} The user object if the user is active and password matches
   */
  userService.authenticate = async (username, password, allowDisabled = false) => {
    const user = await userService.getUserObjectByUsername(username);
    try {
      await bcrypt.compare(password, user.hash);
    } catch (e) {
      if (e instanceof bcrypt.MISMATCH_ERROR) {
        throw new UserError(i18n.__('error.password.mismatch'));
      } else {
        throw e;
      }
    }
    if (user.disabled && !allowDisabled) {
      throw new UserError(i18n.__('error.user.disabled', { reason: user.disableReason }));
    }
    return user;
  };

  /**
   * Reset the password of the user
   * @return {User} The new user object
   */
  userService.resetPassword = async (userId, newPassword) => {
    const user = await userService.getUserObjectById(userId);
    user.hash = await bcrypt.hash(newPassword);
    await user.save();
    return user;
  };

  /**
   * Activate a user
   * @return {User} The new user object
   */
  userService.activateUser = async (username) => {
    const user = await userService.getUserObjectByUsername(username);
    user.disabled = false;
    await user.save();
    return user;
  };

  /**
   * Deactivate a user and prevent him from login
   * @return {User} The new user object
   */
  userService.deactivateUser = async (username, reason) => {
    const user = await userService.getUserObjectByUsername(username);
    user.disabled = true;
    user.disableReason = reason;
    await user.save();
    return user;
  };

  /**
   * Update the profile of a user
   * @return {User} The new user object
   */
  userService.updateProfile = async (userId, profile) => {
    if (profile !== Object(profile)) {
      throw new Error('Expect parameter "profile" to be an object');
    }
    const user = await userService.getUserObjectById(userId);
    user.profile = profile;
    if (user.profile.nickname) {
      user.profile.nickname = user.profile.nickname.substr(0, 15);
    }
    user.markModified('profile');
    user.validated = true;
    await user.save();
    return user;
  };

  userService.checkBodyForCredential = (req, res, next) => {
    req.checkBody({
      username: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
        isLength: {
          options: [{ min: 2, max: 15 }],
          errorMessage: i18n.__('error.username.validation.length', { min: 2, max: 15 }),
        },
      },
      password: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
        isLength: {
          options: [{ min: 5 }],
          errorMessage: i18n.__('error.password.validation.length', { min: 5 }),
        },
      },
    });
    next();
  };

  userService.checkBodyForSetPassword = (req, res, next) => {
    req.checkBody({
      password: {
        notEmpty: true,
        errorMessage: i18n.__('error.validation.required'),
        isLength: {
          options: [{ min: 5 }],
          errorMessage: i18n.__('error.password.validation.length', { min: 5 }),
        },
      },
    });
    next();
  };

  userService.checkBodyForUpdateProfile = (req, res, next) => {
    updateProfileFields.forEach(field => {
      req.checkBody(field, i18n.__('error.validation.required')).notEmpty();
    });
    next();
  };

  return userService;

};
