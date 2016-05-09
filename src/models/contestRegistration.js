import mongoose, { Schema } from 'mongoose';

const ContestRegistrationSchema = new Schema({
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  meta: Schema.Types.Mixed,
}, {
  timestamps: true,
});

ContestRegistrationSchema.index({ user: 1, contest: 1 }, { unique: true });
ContestRegistrationSchema.index({ contest: 1, createdAt: -1 });

mongoose.model('ContestRegistration', ContestRegistrationSchema);
