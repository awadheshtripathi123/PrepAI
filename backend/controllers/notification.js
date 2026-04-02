const InterviewResult = require('../models/InterviewResult');
const AssessmentResult = require('../models/AssessmentResult');
const CodingResult = require('../models/CodingResult');

// @desc      Get notifications
// @route     GET /api/v1/notifications
// @access    Private
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const interviews = await InterviewResult.find({ user: userId }).sort({ completedAt: -1 }).limit(10);
    const assessments = await AssessmentResult.find({ user: userId }).sort({ completedAt: -1 }).limit(10);
    const codingResults = await CodingResult.find({ user: userId }).sort({ completedAt: -1 }).limit(10);

    const notifications = [];

    // Generate notifications from recent interview results
    interviews.forEach((item) => {
      const date = new Date(item.completedAt);
      const timeAgo = getTimeAgo(date);

      if (item.overallScore >= 80) {
        notifications.push({
          title: "Excellent Performance!",
          desc: "You scored " + item.overallScore + "/100 in " + item.role + " interview.",
          time: timeAgo,
          type: "success",
          date: date,
          resultId: item._id,
          resultType: "interview"
        });
      } else if (item.overallScore >= 50) {
        notifications.push({
          title: "Interview Completed",
          desc: "You scored " + item.overallScore + "/100 in " + item.role + " interview.",
          time: timeAgo,
          type: "info",
          date: date,
          resultId: item._id,
          resultType: "interview"
        });
      } else {
        notifications.push({
          title: "Keep Practicing",
          desc: "You scored " + item.overallScore + "/100 in " + item.role + ". Try again!",
          time: timeAgo,
          type: "warning",
          date: date,
          resultId: item._id,
          resultType: "interview"
        });
      }
    });

    // Generate notifications from recent assessments
    assessments.forEach((item) => {
      const date = new Date(item.completedAt);
      const timeAgo = getTimeAgo(date);

      if (item.score >= 80) {
        notifications.push({
          title: "Mock Test Completed",
          desc: "You scored " + item.score + "/100. " + item.correctAnswers + "/" + item.totalQuestions + " correct.",
          time: timeAgo,
          type: "success",
          date: date,
          resultId: item._id,
          resultType: "assessment"
        });
      } else if (item.score >= 50) {
        notifications.push({
          title: "Assessment Submitted",
          desc: "You scored " + item.score + "/100 with " + item.correctAnswers + " correct answers.",
          time: timeAgo,
          type: "info",
          date: date,
          resultId: item._id,
          resultType: "assessment"
        });
      } else {
        notifications.push({
          title: "Low Score Alert",
          desc: "You scored " + item.score + "/100. Review the topics and try again.",
          time: timeAgo,
          type: "warning",
          date: date,
          resultId: item._id,
          resultType: "assessment"
        });
      }
    });

    // Generate notifications from coding submissions
    codingResults.forEach((item) => {
      const date = new Date(item.completedAt);
      const timeAgo = getTimeAgo(date);

      if (item.status === "accepted") {
        notifications.push({
          title: "Code Accepted!",
          desc: "Your " + item.language + " solution was accepted successfully.",
          time: timeAgo,
          type: "success",
          date: date,
          resultId: item._id,
          resultType: "coding"
        });
      } else {
        notifications.push({
          title: "Code Submitted",
          desc: "Your " + item.language + " code has been submitted for review.",
          time: timeAgo,
          type: "info",
          date: date,
          resultId: item._id,
          resultType: "coding"
        });
      }
    });

    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Remove date field before sending
    const result = notifications.slice(0, 20).map(({ date, ...rest }) => rest);

    // If no data, show welcome notification
    if (result.length === 0) {
      result.push({
        title: "Welcome to PrepAI!",
        desc: "Start your first mock interview to get personalized notifications.",
        time: "Just now",
        type: "info"
      });
      result.push({
        title: "Complete Your Profile",
        desc: "Fill in your profile details for a better experience.",
        time: "Just now",
        type: "warning"
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return diffMin + (diffMin === 1 ? " min ago" : " mins ago");
  if (diffHr < 24) return diffHr + (diffHr === 1 ? " hour ago" : " hours ago");
  if (diffDay < 7) return diffDay + (diffDay === 1 ? " day ago" : " days ago");
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
