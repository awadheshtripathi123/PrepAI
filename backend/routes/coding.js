const express = require('express');
const { getProblem, runCode, submitCode } = require('../controllers/coding');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/problem', protect, getProblem);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

module.exports = router;
