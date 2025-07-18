import mongoose from 'mongoose';

const UserProjectSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
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
}, { timestamps: true });

// Ensure unique email per project
UserProjectSchema.index({ project: 1, email: 1 }, { unique: true });

const UserProject = mongoose.model('UserProject', UserProjectSchema);
export default UserProject;
