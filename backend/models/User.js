const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin','Teacher','Student'], required: true },
  profile: {
    name: String,
    description: String,
    specialty: String, // for teachers
    email: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
