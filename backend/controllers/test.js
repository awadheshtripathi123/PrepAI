// @desc      Test route
// @route     GET /api/v1/test
// @access    Private
exports.test = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: `Welcome user ${req.user.name}`
  });
};
