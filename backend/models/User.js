const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  dob: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  userType: {
    type: String,
    enum: ['College Student', 'Professional', 'School Student', 'Fresher', ''],
    default: ''
  },
  domain: {
    type: String,
    enum: ['Management', 'Engineering', 'Art & Science', 'Medical', 'Law', 'Other', ''],
    default: ''
  },
  course: {
    type: String,
    default: ''
  },
  courseSpecialization: {
    type: String,
    default: ''
  },
  courseDuration: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    }
  },
  college: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'Student'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
