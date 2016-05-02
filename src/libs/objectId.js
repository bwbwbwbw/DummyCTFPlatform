import mongoose from 'mongoose';

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

const libObjectId = {

  isValid: (id) => {
    if (id instanceof mongoose.Types.ObjectId) {
      return true;
    }
    id = String(id);
    return checkForHexRegExp.test(id);
  },

  create: (id) => {
    if (id instanceof mongoose.Types.ObjectId) {
      return id;
    } else {
      return mongoose.Types.ObjectId(id);
    }
  },

};

export default libObjectId;
