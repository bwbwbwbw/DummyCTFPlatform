import randomstring from 'randomstring';
import crypto from 'crypto';

export default (DI, db) => {

  const User = db.User;

  const userService = {};

  /**
   * Normalize the username
   * @return {String} normalized username
   */
  userService.normalizeUserNameSync = (username) => {
    return String(username).toLowerCase().trim();
  };

  /**
   * Make hash from specified password and salt
   * @return {String} hash
   */
  userService.hashPasswordSync = (password, salt) => {
    return crypto.createHmac('sha256', password).update(salt).digest('hex');
  };

  /**
   * Generate a salt using PRNG
   * @return {String} 64-byte long random salt
   */
  userService.makeSaltSync = () => {
    return randomstring.generate({ length: 64 });
  };

  /**
   * Get user object by username
   * @return {User} The user object
   */
  userService.getUserObjectByUsername = async (username, throwWhenNotFound = true) => {
    const usernameNormalized = userService.normalizeUserNameSync(username);
    const user = await User.findOne({ username_std: usernameNormalized });
    if (user === null && throwWhenNotFound) {
      throw new UserError('Could not find the specified user');
    }
    return user;
  };

  /**
   * Get user object by id
   * @return {User} The mongoose user object
   */
  userService.getUserObjectById = async (id, throwWhenNotFound = true) => {
    const user = await User.findOne({ id });
    if (user === null && throwWhenNotFound) {
      throw new UserError('Could not find the specified user');
    }
    return user;
  };

  /**
   * Insert a new user into the database
   * @return {User} New user object
   */
  userService.createUser = async (username, password, roles) => {
    if (await userService.getUserObjectByUsername(username, false) !== null) {
      throw new UserError('Username has been taken');
    }
    const salt = userService.makeSaltSync();
    const hash = userService.hashPasswordSync(password, salt);
    const newUser = new User({
      username,
      username_std: userService.normalizeUserNameSync(username),
      hash,
      salt,
      roles,
      disabled: false,
      validated: false,
      profile: {},
    });
    try {
      await newUser.save();
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        // duplicate key error
        throw new UserError('Username has been taken');
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
    if (userService.hashPasswordSync(password, user.salt) !== user.hash) {
      throw new UserError('Password mismatch');
    }
    if (user.disabled && !allowDisabled) {
      throw new UserError('User is disabled');
    }
    return user;
  };

  /**
   * Reset the password of the user
   * @return {User} The new user object
   */
  userService.resetPassword = async (username, newPassword) => {
    const user = await userService.getUserObjectByUsername(username);
    const salt = userService.makeSaltSync();
    const hash = userService.hashPasswordSync(password, salt);
    user.salt = salt;
    user.hash = hash;
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
  userService.deactivateUser = async (username) => {
    const user = await userService.getUserObjectByUsername(username);
    user.disabled = true;
    await user.save();
    return user;
  };

  /**
   * Update the profile of a user
   * @return {User} The new user object
   */
  userService.updateProfile = async (username, profile) => {
    const user = await userService.getUserObjectByUsername(username);
    if (profile !== Object(profile)) {
      // not an object
      return null;
    }
    user.profile = profile;
    await user.save();
    return user;
  };

  userService.checkBodyForCredential = (req, res, next) => {
    req.checkBody({
      username: {
        notEmpty: true,
        errorMessage: 'Required',
        isLength: {
          options: [{ min: 2, max: 15 }],
          errorMessage: 'Must be between 2 and 15 chars long',
        },
      },
      password: {
        notEmpty: true,
        errorMessage: 'Required',
        isLength: {
          options: [{ min: 5 }],
          errorMessage: 'Must be longer than 5 chars',
        },
      },
    });
    next();
  };

  return userService;

}
