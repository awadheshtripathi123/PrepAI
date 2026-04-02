const express = require('express');
const { test } = require('../controllers/test');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, test);

module.exports = router;
