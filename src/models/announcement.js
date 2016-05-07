import mongoose, { Schema } from 'mongoose';

const AnnouncementSchema = new Schema({
  deleted: { type: Boolean, default: false },
  title: String,
  content: String,
}, {
  timestamps: true,
});

AnnouncementSchema.index({ deleted: 1, createdAt: -1 });

mongoose.model('Announcement', AnnouncementSchema);
