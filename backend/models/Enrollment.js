const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  paymentStatus: { type: String, enum: ['Pending','Paid','Overdue'], default: 'Pending' },
  attendance: { type: Number, default: 0 }, // number of attended sessions
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
