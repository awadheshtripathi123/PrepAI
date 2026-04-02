const express = require("express");
const { getQuestions, submitAssessment } = require("../controllers/assessment");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAssessment);

module.exports = router;
