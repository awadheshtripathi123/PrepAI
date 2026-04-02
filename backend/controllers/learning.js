const InterviewResult = require('../models/InterviewResult');
const AssessmentResult = require('../models/AssessmentResult');
const CodingResult = require('../models/CodingResult');

// @desc      Get learning dashboard data
// @route     GET /api/v1/learning
// @access    Private
exports.getLearningData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const interviews = await InterviewResult.find({ user: userId }).sort({ completedAt: -1 });
    const assessments = await AssessmentResult.find({ user: userId }).sort({ completedAt: -1 });
    const codingResults = await CodingResult.find({ user: userId }).sort({ completedAt: -1 });

    const totalSessions = interviews.length + assessments.length + codingResults.length;

    // Average score across all results
    const allScores = [
      ...interviews.map((i) => i.overallScore),
      ...assessments.map((a) => a.score),
      ...codingResults.filter((c) => c.status === 'accepted').map((c) => c.score)
    ];
    const averageScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // Estimated study time (each session ~15 mins)
    const totalMinutes = totalSessions * 15;
    const totalHours = Math.round(totalMinutes / 60);
    const studyTimePercent = totalSessions > 0 ? Math.min(95, 50 + totalSessions * 5) : 0;

    // Learning subjects with progress based on technical scores
    const subjectScores = {};
    const subjectCounts = {};

    interviews.forEach((i) => {
      if (i.technicalScore > 0) {
        if (!subjectScores[i.role]) {
          subjectScores[i.role] = 0;
          subjectCounts[i.role] = 0;
        }
        subjectScores[i.role] += i.technicalScore;
        subjectCounts[i.role]++;
      }
    });

    assessments.forEach((a) => {
      if (a.score > 0) {
        const key = a.role || 'General';
        if (!subjectScores[key]) {
          subjectScores[key] = 0;
          subjectCounts[key] = 0;
        }
        subjectScores[key] += a.score;
        subjectCounts[key]++;
      }
    });

    const subjectColors = [
      { color: "bg-yellow-100", text: "text-red-500" },
      { color: "bg-yellow-300", text: "text-black" },
      { color: "bg-green-200", text: "text-blue-700" },
      { color: "bg-purple-200", text: "text-purple-700" },
      { color: "bg-blue-200", text: "text-blue-700" },
      { color: "bg-cyan-200", text: "text-cyan-700" },
      { color: "bg-green-300", text: "text-green-900" },
      { color: "bg-pink-200", text: "text-pink-700" },
    ];

    const learningSubjects = Object.keys(subjectScores).length > 0
      ? Object.keys(subjectScores).map((name, i) => {
          const avg = Math.round(subjectScores[name] / subjectCounts[name]);
          const colors = subjectColors[i % subjectColors.length];
          return {
            name,
            desc: name + " Practice",
            color: colors.color,
            text: colors.text,
            progress: avg + "%"
          };
        })
      : [
          { name: "Java", desc: "Java DSA Question", color: "bg-yellow-100", text: "text-red-500", progress: "0%" },
          { name: "Python", desc: "Python DSA", color: "bg-purple-200", text: "text-purple-700", progress: "0%" },
          { name: "C++", desc: "STL Practice", color: "bg-blue-200", text: "text-blue-700", progress: "0%" },
          { name: "React", desc: "Frontend Practice", color: "bg-cyan-200", text: "text-cyan-700", progress: "0%" },
        ];

    // Last test result
    const lastTest = assessments.length > 0
      ? {
          subject: assessments[0].role || "General",
          score: assessments[0].score,
          correct: assessments[0].correctAnswers,
          total: assessments[0].totalQuestions,
          date: new Date(assessments[0].completedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
          accuracy: assessments[0].totalQuestions > 0
            ? Math.round((assessments[0].correctAnswers / assessments[0].totalQuestions) * 100)
            : 0
        }
      : null;

    // Performance chart (last 5 sessions)
    const recentScores = [...allScores].reverse().slice(-5);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const performanceChart = recentScores.map((score, i) => ({
      day: days[i % days.length],
      score
    }));

    // Weakest topics from soft skills
    const weakTopics = [];
    const skillScores = {
      communication: { total: 0, count: 0 },
      confidence: { total: 0, count: 0 },
      problemSolving: { total: 0, count: 0 },
      technical: { total: 0, count: 0 }
    };

    interviews.forEach((i) => {
      if (i.communicationScore > 0) { skillScores.communication.total += i.communicationScore; skillScores.communication.count++; }
      if (i.confidenceScore > 0) { skillScores.confidence.total += i.confidenceScore; skillScores.confidence.count++; }
      if (i.problemSolvingScore > 0) { skillScores.problemSolving.total += i.problemSolvingScore; skillScores.problemSolving.count++; }
      if (i.technicalScore > 0) { skillScores.technical.total += i.technicalScore; skillScores.technical.count++; }
    });

    Object.keys(skillScores).forEach((key) => {
      if (skillScores[key].count > 0) {
        const avg = Math.round(skillScores[key].total / skillScores[key].count);
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
        weakTopics.push({ name: label, score: avg });
      }
    });

    weakTopics.sort((a, b) => a.score - b.score);

    // AI suggestions based on weak topics
    const aiSuggestions = [];
    if (weakTopics.length > 0) {
      weakTopics.forEach((t) => {
        if (t.score < 60) {
          aiSuggestions.push("Improve " + t.name.toLowerCase() + " skills");
        }
      });
    }
    if (aiSuggestions.length === 0) {
      aiSuggestions.push("Keep practicing consistently");
      aiSuggestions.push("Try harder difficulty levels");
      aiSuggestions.push("Focus on time management");
    }

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        studyTimePercent,
        totalHours,
        averageScore,
        learningSubjects,
        lastTest,
        performanceChart: performanceChart.length > 0 ? performanceChart : days.slice(0, 5).map((d) => ({ day: d, score: 0 })),
        weakTopics: weakTopics.length > 0 ? weakTopics : [
          { name: "Dynamic Programming", score: 0 },
          { name: "Recursion", score: 0 },
          { name: "Graph", score: 0 }
        ],
        aiSuggestions
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
