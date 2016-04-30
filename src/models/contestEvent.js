import mongoose, { Schema } from 'mongoose';

const ContestEventSchema = new Schema({
  published: { type: Boolean, default: false },
  createAt: Date,
  updateAt: Date,
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  content: String,
  args: Schema.Types.Mixed,
});

ContestEventSchema.index({ contest: 1, published: 1, at: -1 });

mongoose.model('ContestEvent', ContestEventSchema);
