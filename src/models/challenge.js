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

ChallengeSchema.index({ deleted: 1, category: 1, name: 1 });

mongoose.model('Challenge', ChallengeSchema);
