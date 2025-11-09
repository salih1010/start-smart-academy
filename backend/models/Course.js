const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  teacher: { type: Schema.Types.ObjectId, ref: 'User' }, // teacher user
  startDate: Date,
  endDate: Date,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
