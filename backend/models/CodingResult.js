const mongoose = require('mongoose');

const CodingResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  output: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['run', 'submitted', 'accepted', 'wrong_answer'],
    default: 'run'
  },
  score: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodingResult', CodingResultSchema);
