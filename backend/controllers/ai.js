const {
  generateChatResponse,
  generateCustomQuestions,
} = require("../utils/aiService");
const InterviewResult = require("../models/InterviewResult");
const AssessmentResult = require("../models/AssessmentResult");

// @desc      AI Chat (fully dynamic via DeepSeek)
// @route     POST /api/v1/ai/chat
// @access    Private
exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a message" });
    }

    const interviews = await InterviewResult.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(5);
    const assessments = await AssessmentResult.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(5);

    const totalSessions = interviews.length + assessments.length;
    const allScores = [
      ...interviews.map((i) => i.overallScore),
      ...assessments.map((a) => a.score),
    ];
    const avgScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    const userContext =
      "Total sessions: " +
      totalSessions +
      ", Average score: " +
      avgScore +
      "/100, Recent roles: " +
      (interviews.map((i) => i.role).join(", ") || "None") +
      ", Recent scores: " +
      (allScores.slice(0, 5).join(", ") || "None");

    const response = await generateChatResponse(
      message,
      req.user.name,
      userContext
    );

    if (!response) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate AI response. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get AI analytics data
// @route     GET /api/v1/ai/analytics
// @access    Private
exports.getAIAnalytics = async (req, res, next) => {
  try {
    const interviews = await InterviewResult.find({ user: req.user.id }).sort({
      completedAt: -1,
    });
    const assessments = await AssessmentResult.find({ user: req.user.id }).sort(
      { completedAt: -1 }
    );

    const confScores = interviews
      .map((i) => i.confidenceScore)
      .filter((s) => s > 0);
    const confidence =
      confScores.length > 0
        ? Math.round(confScores.reduce((a, b) => a + b, 0) / confScores.length)
        : 0;

    const accScores = assessments.map((a) => a.score).filter((s) => s > 0);
    const accuracy =
      accScores.length > 0
        ? Math.round(accScores.reduce((a, b) => a + b, 0) / accScores.length)
        : 0;

    const commScores = interviews
      .map((i) => i.communicationScore)
      .filter((s) => s > 0);
    const communication =
      commScores.length > 0
        ? Math.round(commScores.reduce((a, b) => a + b, 0) / commScores.length)
        : 0;

    res.status(200).json({
      success: true,
      data: { confidence, accuracy, communication },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Generate custom questions
// @route     POST /api/v1/ai/generate-questions
// @access    Private
exports.generateQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty = "Intermediate", count = 5, type = "multiple-choice" } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: "Please provide a topic" });
    }

    const questions = await generateCustomQuestions(topic, difficulty, count, type);

    if (!questions) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate questions. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
