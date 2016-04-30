import mongoose, { Schema } from 'mongoose';

const ContestRegistrationSchema = new Schema({
  at: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
});

ContestRegistrationSchema.index({ user: 1, contest: 1 }, { unique: true });

mongoose.model('ContestRegistration', ContestRegistrationSchema);
