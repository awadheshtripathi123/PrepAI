const mongoose = require('mongoose');

const InterviewResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  mode: {
    type: String,
    enum: ['Assessment', 'Interview', 'Technical Round', 'All'],
    default: 'All'
  },
  assessmentScore: {
    type: Number,
    default: 0
  },
  assessmentTotal: {
    type: Number,
    default: 0
  },
  codingScore: {
    type: Number,
    default: 0
  },
  codingTotal: {
    type: Number,
    default: 0
  },
  interviewScore: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advance'],
    default: 'Beginner'
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  confidenceScore: {
    type: Number,
    default: 0
  },
  problemSolvingScore: {
    type: Number,
    default: 0
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  recommendations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  strongTopics: {
    type: [String],
    default: []
  },
  weakTopics: {
    type: [String],
    default: []
  },
  assessmentDetails: {
    type: Array,
    default: []
  },
  codingDetails: {
    type: Array,
    default: []
  },
  interviewDetails: {
    type: Array,
    default: []
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewResult', InterviewResultSchema);
