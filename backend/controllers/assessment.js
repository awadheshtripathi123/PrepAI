const AssessmentResult = require("../models/AssessmentResult");
const { generateAssessmentQuestions } = require("../utils/aiService");

// @desc      Get assessment questions (AI-generated)
// @route     GET /api/v1/assessment/questions
// @access    Private
exports.getQuestions = async (req, res, next) => {
  try {
    const { role, difficulty } = req.query;

    let qCount = 15;
    if (difficulty === 'Intermediate') qCount = 10;
    else if (difficulty === 'Advance' || difficulty === 'Advanced') qCount = 5;

    const questions = await generateAssessmentQuestions(
      role || "Software Developer",
      difficulty || "Intermediate",
      qCount
    );

    if (!questions || questions.length < 3) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate questions. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Submit assessment answers
// @route     POST /api/v1/assessment/submit
// @access    Private
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers, questions, role, difficulty } = req.body;

    if (!answers || !questions) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide answers and questions" });
    }

    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((q, i) => {
      if (q.answer === answers[i + 1]) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const result = await AssessmentResult.create({
      user: req.user.id,
      answers,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      role: role || "",
      difficulty: difficulty || "",
    });

    res.status(200).json({
      success: true,
      data: {
        score,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers,
        totalQuestions,
        resultId: result._id,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
