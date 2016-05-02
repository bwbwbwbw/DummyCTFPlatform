import mongoose, { Schema } from 'mongoose';

const ContestEventSchema = new Schema({
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  published: { type: Boolean, default: false },
  processed: { type: Boolean, default: false },
  content: String,
  args: Schema.Types.Mixed,
}, {
  timestamps: true,
});

ContestEventSchema.index({ contest: 1, published: 1, updatedAt: -1 });
ContestEventSchema.index({ contest: 1, updatedAt: -1 });

mongoose.model('ContestEvent', ContestEventSchema);
