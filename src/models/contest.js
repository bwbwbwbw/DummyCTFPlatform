import mongoose, { Schema } from 'mongoose';

const ContestSchema = new Schema({
  deleted: { type: Boolean, default: false },
  name: String,
  begin: Date,
  end: Date,
  regBegin: Date,
  regEnd: Date,
  challenges: [{
    id: { type: Schema.Types.ObjectId, ref: 'Challenge' },
    visible: Boolean,
    score: Number,
    scoreDecrease: Number,
    minScore: Number,
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ContestSchema.virtual('state').get(function () {
  const now = Date.now();
  if (now < this.regBegin.getTime()) {
    return 'UPCOMING';
  } else if (now < this.begin.getTime()) {
    return 'READY';
  } else if (now <= this.end.getTime()) {
    return 'ACTIVE';
  } else {
    return 'DONE';
  }
});

ContestSchema.index({ deleted: 1, begin: -1 });

mongoose.model('Contest', ContestSchema);
