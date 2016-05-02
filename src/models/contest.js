import mongoose, { Schema } from 'mongoose';

const ContestSchema = new Schema({
  deleted: { type: Boolean, default: false },
  name: String,
  begin: Date,
  end: Date,
  regBegin: Date,
  regEnd: Date,
}, {
  timestamps: true,
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

ContestSchema.virtual('regState').get(function () {
  const now = Date.now();
  if (now < this.regBegin.getTime()) {
    return 'UPCOMING';
  } else if (now <= this.regEnd.getTime()) {
    return 'OPEN';
  } else {
    return 'CLOSE';
  }
});

ContestSchema.index({ deleted: 1, begin: -1 });

mongoose.model('Contest', ContestSchema);
