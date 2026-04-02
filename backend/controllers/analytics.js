const InterviewResult = require('../models/InterviewResult');
const AssessmentResult = require('../models/AssessmentResult');
const CodingResult = require('../models/CodingResult');

// @desc      Get analytics data
// @route     GET /api/v1/analytics
// @access    Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all results for this user
    const interviews = await InterviewResult.find({ user: userId }).sort({ completedAt: -1 });
    const assessments = await AssessmentResult.find({ user: userId }).sort({ completedAt: -1 });
    const codingResults = await CodingResult.find({ user: userId, status: 'accepted' }).sort({ completedAt: -1 });

    const totalInterviews = interviews.length;

    // Calculate average score
    let totalScore = 0;
    let scoreCount = 0;

    interviews.forEach((i) => {
      if (i.overallScore > 0) {
        totalScore += i.overallScore;
        scoreCount++;
      }
    });
    assessments.forEach((a) => {
      totalScore += a.score;
      scoreCount++;
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    // Calculate score improvement (compare last 2 months)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const lastMonthScores = [
      ...interviews.filter((i) => new Date(i.completedAt) >= lastMonth).map((i) => i.overallScore),
      ...assessments.filter((a) => new Date(a.completedAt) >= lastMonth).map((a) => a.score)
    ];
    const prevMonthScores = [
      ...interviews.filter((i) => {
        const d = new Date(i.completedAt);
        return d >= twoMonthsAgo && d < lastMonth;
      }).map((i) => i.overallScore),
      ...assessments.filter((a) => {
        const d = new Date(a.completedAt);
        return d >= twoMonthsAgo && d < lastMonth;
      }).map((a) => a.score)
    ];

    const lastAvg = lastMonthScores.length > 0
      ? lastMonthScores.reduce((a, b) => a + b, 0) / lastMonthScores.length
      : 0;
    const prevAvg = prevMonthScores.length > 0
      ? prevMonthScores.reduce((a, b) => a + b, 0) / prevMonthScores.length
      : 0;
    const scoreImprovement = prevAvg > 0 ? Math.round(((lastAvg - prevAvg) / prevAvg) * 100) : 0;

    // Determine strongest skill
    const techScores = {
      Java: 0, DSA: 0, OOPS: 0, SQL: 0, 'Web Dev': 0
    };
    const techCounts = { Java: 0, DSA: 0, OOPS: 0, SQL: 0, 'Web Dev': 0 };

    interviews.forEach((i) => {
      if (i.technicalScore > 0) {
        Object.keys(techScores).forEach((skill) => {
          techScores[skill] += i.technicalScore;
          techCounts[skill]++;
        });
      }
    });

    let strongestSkill = 'Technical Knowledge';
    let strongestScore = 0;
    Object.keys(techScores).forEach((skill) => {
      const avg = techCounts[skill] > 0 ? Math.round(techScores[skill] / techCounts[skill]) : 0;
      if (avg > strongestScore) {
        strongestScore = avg;
        strongestSkill = skill;
      }
    });

    // Soft skills from real interview data
    let avgCommunication = 0;
    let avgConfidence = 0;
    let avgProblemSolving = 0;
    const interviewCount = interviews.length;

    if (interviewCount > 0) {
      avgCommunication = Math.round(
        interviews.reduce((sum, i) => sum + (i.communicationScore || 0), 0) / interviewCount
      );
      avgConfidence = Math.round(
        interviews.reduce((sum, i) => sum + (i.confidenceScore || 0), 0) / interviewCount
      );
      avgProblemSolving = Math.round(
        interviews.reduce((sum, i) => sum + (i.problemSolvingScore || 0), 0) / interviewCount
      );
    }

    const softSkills = [
      {
        title: 'Communication Skills',
        value: avgCommunication,
        details: ['Clarity', 'Confidence', 'Fluency', 'Vocabulary'],
        suggestion: avgCommunication < 50
          ? 'Improve structured answers using STAR method'
          : avgCommunication < 75
          ? 'Good progress. Practice more complex scenarios'
          : 'Excellent communication skills. Keep it up'
      },
      {
        title: 'Body Language & Confidence',
        value: avgConfidence,
        details: ['Eye Contact', 'Posture', 'Facial Expression'],
        suggestion: avgConfidence < 50
          ? 'Practice mock interview with camera on'
          : avgConfidence < 75
          ? 'Good confidence. Work on maintaining eye contact'
          : 'Great body language and confidence'
      },
      {
        title: 'Problem-Solving Approach',
        value: avgProblemSolving,
        details: ['Logical Thinking', 'Code Explanation', 'Edge Case Handling'],
        suggestion: avgProblemSolving < 50
          ? 'Structure your thinking process step by step'
          : avgProblemSolving < 75
          ? 'Good problem solving. Practice edge cases more'
          : 'Excellent problem-solving approach'
      }
    ];

    // Technical skills from assessments
    const technicalSkills = [
      { name: 'Java', score: techCounts.Java > 0 ? Math.round(techScores.Java / techCounts.Java) : 0 },
      { name: 'DSA', score: techCounts.DSA > 0 ? Math.round(techScores.DSA / techCounts.DSA) : 0 },
      { name: 'OOPS', score: techCounts.OOPS > 0 ? Math.round(techScores.OOPS / techCounts.OOPS) : 0 },
      { name: 'SQL', score: techCounts.SQL > 0 ? Math.round(techScores.SQL / techCounts.SQL) : 0 },
      { name: 'Web Dev', score: techCounts['Web Dev'] > 0 ? Math.round(techScores['Web Dev'] / techCounts['Web Dev']) : 0 }
    ];

    // Domain performance based on role
    const domainMap = {};
    interviews.forEach((i) => {
      const domain = i.role || 'General';
      if (!domainMap[domain]) {
        domainMap[domain] = { total: 0, count: 0 };
      }
      domainMap[domain].total += i.overallScore;
      domainMap[domain].count++;
    });

    const domainPerformance = Object.keys(domainMap).length > 0
      ? Object.keys(domainMap).map((d) => ({
          name: d,
          score: Math.round(domainMap[d].total / domainMap[d].count)
        }))
      : [
          { name: 'Frontend', score: 0 },
          { name: 'Backend', score: 0 },
          { name: 'Android', score: 0 },
          { name: 'AI/ML', score: 0 },
          { name: 'Full Stack', score: 0 }
        ];

    // Interview history from real data
    const interviewHistory = interviews.slice(0, 10).map((i) => ({
      date: new Date(i.completedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      role: i.role,
      score: i.overallScore,
      level: i.level
    }));

    // Monthly score trend
    const monthlyScores = {};
    [...interviews, ...assessments].forEach((item) => {
      const date = new Date(item.completedAt);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      const score = item.overallScore || item.score;
      if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = { total: 0, count: 0 };
      }
      monthlyScores[monthKey].total += score;
      monthlyScores[monthKey].count++;
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyScoreTrend = monthOrder
      .filter((m) => monthlyScores[m])
      .map((m) => ({
        month: m,
        score: Math.round(monthlyScores[m].total / monthlyScores[m].count)
      }));

    // If no data, show empty trend
    const monthlyPerformance = monthlyScoreTrend.length > 0
      ? monthlyScoreTrend
      : monthOrder.slice(0, 8).map((m) => ({ month: m, score: 0 }));

    // Last interview date
    const lastInterviewDate = interviews.length > 0
      ? new Date(interviews[0].completedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : 'No interviews yet';

    // AI feedback based on real data
    let aiFeedback = 'Start taking interviews to get personalized feedback.';
    if (totalInterviews > 0) {
      if (averageScore >= 80) {
        aiFeedback = 'Outstanding performance! You are interview-ready. Keep practicing to maintain your edge.';
      } else if (averageScore >= 60) {
        aiFeedback = 'Good progress! Focus on weak areas to push your score above 80%.';
      } else if (averageScore >= 40) {
        aiFeedback = 'You are improving. Practice more mock interviews and focus on technical skills.';
      } else {
        aiFeedback = 'Keep practicing! Start with beginner-level interviews and build your confidence.';
      }
    }

    const analyticsData = {
      totalInterviews,
      lastInterviewDate,
      averageScore,
      scoreImprovement,
      strongestSkill: strongestScore > 0 ? `${strongestSkill} - ${strongestScore}%` : 'No data yet',
      softSkills,
      technicalSkills,
      domainPerformance,
      interviewHistory,
      monthlyScoreTrend,
      monthlyPerformance,
      aiFeedback
    };

    res.status(200).json({ success: true, data: analyticsData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
