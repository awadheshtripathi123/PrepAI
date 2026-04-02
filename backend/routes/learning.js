const express = require('express');
const { getLearningData } = require('../controllers/learning');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getLearningData);

module.exports = router;
