import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Email verification fields
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    // 2FA placeholders
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: String,
    backupCodes: [String],

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;