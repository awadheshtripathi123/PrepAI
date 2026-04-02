const express = require('express');
const { googleLogin, appleLogin } = require('../controllers/oauth');

const router = express.Router();

router.post('/google', googleLogin);
router.post('/apple', appleLogin);

module.exports = router;
