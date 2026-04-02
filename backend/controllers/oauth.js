const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// @desc      Google OAuth login
// @route     POST /api/v1/auth/google
// @access    Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a Google token'
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        name,
        email,
        password: googleId + process.env.JWT_SECRET,
        image: picture || null
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(401).json({
      success: false,
      error: 'Google authentication failed. Please try again.'
    });
  }
};

// @desc      Apple OAuth login
// @route     POST /api/v1/auth/apple
// @access    Public
exports.appleLogin = async (req, res, next) => {
  try {
    const { identityToken, user: appleUser } = req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an Apple identity token'
      });
    }

    // Decode the Apple identity token (JWT)
    const decoded = jwt.decode(identityToken, { complete: true });

    if (!decoded || !decoded.payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Apple identity token'
      });
    }

    const { email, sub: appleId } = decoded.payload;

    // Apple only sends name on first login
    let name = 'Apple User';
    if (appleUser && appleUser.name) {
      name = `${appleUser.name.firstName || ''} ${appleUser.name.lastName || ''}`.trim();
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Apple did not provide an email address'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Apple data
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: appleId + process.env.JWT_SECRET
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Apple login error:', err.message);
    res.status(401).json({
      success: false,
      error: 'Apple authentication failed. Please try again.'
    });
  }
};
