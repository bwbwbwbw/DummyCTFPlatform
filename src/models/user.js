import mongoose, { Schema } from 'mongoose';
import { roles } from 'constants/index';

const UserSchema = new Schema({
  username: String,
  username_std: String, // normalized user name
  hash: String,
  salt: String,
  roles: [Number],
  disabled: { type: Boolean, default: false },
  validated: { type: Boolean, default: false },
  profile: {
    name: String,
    stdid: String,
    phone: String,
    email: String,
  },
});

UserSchema.methods.isContester = function () {
  return this.roles.indexOf(roles.ROLE_CONTESTER) !== -1;
};

UserSchema.methods.isAdmin = function () {
  return this.roles.indexOf(roles.ROLE_ADMIN) !== -1;
};

UserSchema.index({ username_std: 1 }, { unique: true });

mongoose.model('User', UserSchema);
