import mongoose, { Schema } from 'mongoose';

const ContestEventSchema = new Schema({
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
  published: { type: Boolean, default: false },
  processed: { type: Boolean, default: false },
  content: String,
  args: Schema.Types.Mixed,
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ContestEventSchema.virtual('state').get(function () {
  if (!this.processed) {
    return 'PENDING';
  } else {
    if (this.published) {
      return 'PUBLISHED';
    } else {
      return 'IGNORED';
    }
  }
});

ContestEventSchema.index({ contest: 1, published: 1, createdAt: -1 });
ContestEventSchema.index({ contest: 1, createdAt: -1 });

mongoose.model('ContestEvent', ContestEventSchema);
