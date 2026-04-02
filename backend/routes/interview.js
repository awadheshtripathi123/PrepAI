const express = require("express");
const {
  getQuestions,
  nextQuestion,
  evaluate,
  saveResult,
  getResults,
  getResult,
} = require("../controllers/interview");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/next-question", protect, nextQuestion);
router.post("/evaluate", protect, evaluate);
router.post("/result", protect, saveResult);
router.get("/results", protect, getResults);
router.get("/result/:id", protect, getResult);

module.exports = router;
