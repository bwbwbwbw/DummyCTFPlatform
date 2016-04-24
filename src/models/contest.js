import mongoose, { Schema } from 'mongoose';

const ContestSchema = new Schema({
  name: String,
  begin: Date,
  end: Date,
  attendBegin: Date,
  attendEnd: Date,
  challenges: [{
    id: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    visible: Boolean,
    score: Number,
    scoreDecrease: Number,
    minScore: Number,
  }],
});

mongoose.model('Contest', ContestSchema);
