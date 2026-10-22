const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'admin'],
    default: 'farmer'
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    village: { type: String, default: '' }
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'te'],
    default: 'en'
  }
}, { timestamps: true });

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
