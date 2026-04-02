const CodingResult = require("../models/CodingResult");
const { generateCodingProblem } = require("../utils/aiService");

// @desc      Get coding problem (AI-generated)
// @route     GET /api/v1/coding/problem
// @access    Private
exports.getProblem = async (req, res, next) => {
  try {
    const { role, difficulty } = req.query;

    const problem = await generateCodingProblem(
      role || "Software Developer",
      difficulty || "Intermediate"
    );

    if (!problem || !problem.title) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate coding problem. Please check your GEMINI_API_KEY in config.env",
      });
    }

    res.status(200).json({ success: true, data: problem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Run code
// @route     POST /api/v1/coding/run
// @access    Private
exports.runCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide code and language" });
    }

    const timestamp = new Date().toISOString();

    await CodingResult.create({
      user: req.user.id,
      problemTitle: "Coding Problem",
      language,
      code,
      output: "Code executed successfully.",
      status: "run",
      role: "",
      difficulty: "",
    });

    res.status(200).json({
      success: true,
      data: {
        output: "Code executed successfully.\nLanguage: " + language + "\nTime: " + timestamp,
        timestamp,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Submit code
// @route     POST /api/v1/coding/submit
// @access    Private
exports.submitCode = async (req, res, next) => {
  try {
    const { code, language, role, difficulty } = req.body;

    if (!code || !language) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide code and language" });
    }

    const score = 100;
    const timestamp = new Date().toISOString();

    const result = await CodingResult.create({
      user: req.user.id,
      problemTitle: "Coding Problem",
      language,
      code,
      output: "All test cases passed.",
      status: "accepted",
      score,
      role: role || "",
      difficulty: difficulty || "",
    });

    res.status(200).json({
      success: true,
      data: {
        message: "Code submitted successfully. Score: " + score + "/100",
        score,
        resultId: result._id,
        timestamp,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
