import bcrypt from 'bcrypt-as-promised';
import mongoose, { Schema } from 'mongoose';

const ChallengeSchema = new Schema({
  deleted: { type: Boolean, default: false },
  name: String,
  flag: String,   // salt+hash
  flagThumb: String, // part of the original flag, for searching purpose
  category: { type: String, lowercase: true },
  difficulty: Number,
  description: String,
}, {
  timestamps: true,
});

/**
 * Hash the flag and set the flag thumbnail
 */
ChallengeSchema.methods.setFlag = async function (plainFlag) {
  let flagThumb;
  if (plainFlag.length > 10) {
    flagThumb = plainFlag.substr(0, 6) + '...' + plainFlag.substr(-4, 4);
  } else {
    flagThumb = plainFlag.substr(0, 3) + '...';
  }
  this.flag = await bcrypt.hash(plainFlag, 10);
  this.flagThumb = flagThumb;
};

/**
 * Test whether a flag is correct
 */
ChallengeSchema.methods.testFlag = async function (flag) {
  try {
    await bcrypt.compare(flag, this.flag);
  } catch (e) {
    if (e instanceof bcrypt.MISMATCH_ERROR) {
      return false;
    } else {
      throw e;
    }
  }
  return true;
};

ChallengeSchema.index({ deleted: 1, category: 1, name: 1 });

mongoose.model('Challenge', ChallengeSchema);
