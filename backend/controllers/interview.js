const {
  generateInterviewQuestions,
  generateNextQuestion,
  evaluateAnswer,
  generatePerformanceEvaluation,
} = require("../utils/aiService");
const InterviewResult = require("../models/InterviewResult");

// @desc      Get interview questions (AI-generated)
// @route     GET /api/v1/interview/questions
// @access    Private
exports.getQuestions = async (req, res, next) => {
  try {
    const { role, difficulty } = req.query;

    let qCount = 15;
    if (difficulty === 'Intermediate') qCount = 10;
    else if (difficulty === 'Advance' || difficulty === 'Advanced') qCount = 5;

    const questions = await generateInterviewQuestions(
      role || "Software Developer",
      difficulty || "Intermediate",
      qCount
    );

    if (!questions || questions.length < 3) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate interview questions. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get next question based on candidate's answer (live AI)
// @route     POST /api/v1/interview/next-question
// @access    Private
exports.nextQuestion = async (req, res, next) => {
  try {
    const { role, previousQuestion, previousAnswer } = req.body;

    if (!previousQuestion || !previousAnswer) {
      return res.status(400).json({
        success: false,
        error: "Please provide previous question and answer",
      });
    }

    const nextQ = await generateNextQuestion(
      role || "Software Developer",
      previousQuestion,
      previousAnswer
    );

    if (!nextQ) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate next question. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: { question: nextQ } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Evaluate candidate's answer (live AI)
// @route     POST /api/v1/interview/evaluate
// @access    Private
exports.evaluate = async (req, res, next) => {
  try {
    const { role, question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Please provide question and answer",
      });
    }

    const evaluation = await evaluateAnswer(
      role || "Software Developer",
      question,
      answer
    );

    if (!evaluation) {
      return res.status(500).json({
        success: false,
        error: "Failed to evaluate answer. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: evaluation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Save interview result
// @route     POST /api/v1/interview/result
// @access    Private
exports.saveResult = async (req, res, next) => {
  try {
    const {
      role,
      difficulty,
      mode,
      assessmentScore,
      assessmentTotal,
      codingScore,
      codingTotal,
      interviewScore,
      interviewEvaluations,
      overallScore,
      communicationScore,
      confidenceScore,
      problemSolvingScore,
      technicalScore,
      feedback,
      assessmentDetails,
      codingDetails,
    } = req.body;

    let level = "Beginner";
    if (overallScore >= 80) level = "Advance";
    else if (overallScore >= 50) level = "Intermediate";

    const aiEvaluation = await generatePerformanceEvaluation(
      role || "General",
      mode || "All",
      difficulty || "Intermediate",
      {
        overallScore: overallScore || 0,
        communicationScore: communicationScore || 0,
        confidenceScore: confidenceScore || 0,
        problemSolvingScore: problemSolvingScore || 0,
        technicalScore: technicalScore || 0,
        assessmentScore: assessmentScore || 0,
        codingScore: codingScore || 0,
        interviewScore: interviewScore || 0
      },
      assessmentDetails || [],
      codingDetails || [],
      interviewEvaluations || []
    );

    const result = await InterviewResult.create({
      user: req.user.id,
      role: role || "General",
      difficulty: difficulty || "Intermediate",
      mode: mode || "All",
      assessmentScore: assessmentScore || 0,
      assessmentTotal: assessmentTotal || 0,
      codingScore: codingScore || 0,
      codingTotal: codingTotal || 0,
      interviewScore: interviewScore || 0,
      overallScore: overallScore || 0,
      level,
      communicationScore: communicationScore || 0,
      confidenceScore: confidenceScore || 0,
      problemSolvingScore: problemSolvingScore || 0,
      technicalScore: technicalScore || 0,
      feedback: aiEvaluation.feedback,
      recommendations: aiEvaluation.recommendations,
      strongTopics: aiEvaluation.strongTopics,
      weakTopics: aiEvaluation.weakTopics,
      assessmentDetails: assessmentDetails || [],
      codingDetails: codingDetails || [],
      interviewDetails: interviewEvaluations || [],
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get all interview results for user
// @route     GET /api/v1/interview/results
// @access    Private
exports.getResults = async (req, res, next) => {
  try {
    const results = await InterviewResult.find({ user: req.user.id }).sort({
      completedAt: -1,
    });

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get single interview result
// @route     GET /api/v1/interview/result/:id
// @access    Private
exports.getResult = async (req, res, next) => {
  try {
    const result = await InterviewResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, error: "Result not found" });
    }

    if (result.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to view this result" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
