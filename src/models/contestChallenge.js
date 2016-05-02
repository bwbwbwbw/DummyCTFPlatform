import mongoose, { Schema } from 'mongoose';

const ContestChallengeSchema = new Schema({
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  visible: Boolean,
  score: Number,
  scoreDecrease: Number,
  minScore: Number,
}, {
  timestamps: true,
});

ContestChallengeSchema.index({ contest: 1, challenge: 1 }, { unique: true });
ContestChallengeSchema.index({ contest: 1, updatedAt: -1 });
ContestChallengeSchema.index({ contest: 1, visible: 1, updatedAt: -1 });

mongoose.model('ContestChallenge', ContestChallengeSchema);
