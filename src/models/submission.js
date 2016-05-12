import mongoose, { Schema } from 'mongoose';

const SubmissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  cc: { type: Schema.Types.ObjectId, ref: 'ContestChallenge' },
  input: String,
  valid: Boolean,
  ip: String,
}, {
  timestamps: true,
});

// user task view
SubmissionSchema.index({ user: 1, contest: 1, valid: 1 });

// submission insertion
SubmissionSchema.index({ user: 1, cc: 1, valid: 1 });

// contest challenge view
SubmissionSchema.index({ cc: 1, createdAt: -1 });

mongoose.model('Submission', SubmissionSchema);
