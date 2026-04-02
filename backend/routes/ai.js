const express = require("express");
const {
  chat,
  getAIAnalytics,
  generateQuestions,
} = require("../controllers/ai");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/chat", protect, chat);
router.post("/generate-questions", protect, generateQuestions);
router.get("/analytics", protect, getAIAnalytics);

module.exports = router;
