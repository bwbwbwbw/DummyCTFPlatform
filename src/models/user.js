import bcrypt from 'bcrypt-as-promised';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  deleted: { type: Boolean, default: false },
  username: String,
  username_std: String, // normalized user name
  hash: String,
  roles: [String],
  disabled: { type: Boolean, default: false },
  disableReason: String,
  validated: { type: Boolean, default: false },
  profile: {
    nickname: String,
    name: String,
    stdid: String,
    department: String,
    grade: String,
    phone: String,
    email: String,
  },
}, {
  timestamps: true,
});

UserSchema.methods.isContester = function () {
  return this.roles.indexOf('CONTESTER') !== -1;
};

UserSchema.methods.isAdmin = function () {
  return this.roles.indexOf('ADMIN') !== -1;
};

/**
 * Set the password hash
 */
UserSchema.methods.setPassword = async function (plain) {
  this.hash = await bcrypt.hash(plain, 10);
};

/**
 * Test whether a password matches the hash
 */
UserSchema.methods.testPassword = async function (password) {
  try {
    await bcrypt.compare(password, this.hash);
  } catch (e) {
    if (e instanceof bcrypt.MISMATCH_ERROR) {
      return false;
    } else {
      throw e;
    }
  }
  return true;
};

UserSchema.index({ username_std: 1 }, { unique: true });
UserSchema.index({ deleted: 1, createdAt: -1 });

mongoose.model('User', UserSchema);
