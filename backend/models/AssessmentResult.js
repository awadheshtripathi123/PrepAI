const mongoose = require('mongoose');

const AssessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: Map,
    of: String
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
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

module.exports = mongoose.model('AssessmentResult', AssessmentResultSchema);
