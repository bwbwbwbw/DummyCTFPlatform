import mongoose, { Schema } from 'mongoose';

const SystemPropertySchema = new Schema({
  key: String,
  value: Schema.Types.Mixed,
});

SystemPropertySchema.index({ key: 1 });

mongoose.model('SystemProperty', SystemPropertySchema);
