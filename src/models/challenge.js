import mongoose, { Schema } from 'mongoose';

const ChallengeSchema = new Schema({
  name: String,
  flag: String,   // hash
  salt: String,
  flagThumb: String, // part of the original flag, for searching purpose
  category: String,
  difficulty: Number,
  description: String,
});

mongoose.model('Challenge', ChallengeSchema);
