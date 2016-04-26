import mongoose, { Schema } from 'mongoose';

const ChallengeSchema = new Schema({
  name: String,
  flag: String,   // salt+hash
  flagThumb: String, // part of the original flag, for searching purpose
  category: { type: String, lowercase: true },
  difficulty: Number,
  description: String,
});

ChallengeSchema.index({ category: 1, name: 1 });

mongoose.model('Challenge', ChallengeSchema);
