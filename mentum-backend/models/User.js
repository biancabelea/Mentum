const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userYear: { type: String, required: true },
    userRole: { type: String, enum: ['Student', 'Mentor'], required: true },
    userSkills: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
