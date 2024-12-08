const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'mentor', 'both'], default: 'both' },
    // skills: { type: [String], default: [] },
    // bio: { type: String, default: '' },
    // rating: { type: Number, default: 0 },
}, { timestamps: true });

// Pre-save hook to hash passwords
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
