import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Learning = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user name
        const userRes = await authFetch("/api/v1/auth/me");
        const userData = await userRes.json();
        if (userData.success) {
          setUserName(userData.data.name);
        }

        // Fetch learning data
        const learningRes = await authFetch("/api/v1/learning");
        const learningJson = await learningRes.json();
        if (learningJson.success) {
          setLearningData(learningJson.data);
        }
      } catch (error) {
        console.error("Failed to fetch learning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const data = learningData || {
    totalSessions: 0,
    studyTimePercent: 0,
    totalHours: 0,
    averageScore: 0,
    learningSubjects: [],
    lastTest: null,
    performanceChart: [],
    weakTopics: [],
    aiSuggestions: []
  };

  return (
    <div className="space-y-6">

      {/* TOP CARD */}
      <div className="card-dark px-6 py-6 min-h-[40vh] flex flex-col lg:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Welcome Back, {userName || "User"}!
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Let's conquer your interview today.
          </p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => navigate("/community")}
              className="btn-primary text-sm px-4 py-2"
            >
              Community Hub
            </button>
            <button
              onClick={() => navigate("/mock/performance")}
              className="btn-primary opacity-90 px-5 py-2"
            >
              Start a Mock Test
            </button>
          </div>
        </div>

        <div className="flex gap-10 text-sm text-gray-300 mt-6 lg:mt-0 text-center">
          <div>
            <p className="text-white font-semibold">{data.totalSessions}</p>
            <p className="text-xs text-gray-400">Total Sessions</p>
          </div>
          <div>
            <p className="text-white font-semibold">{data.studyTimePercent}%</p>
            <p className="text-xs text-gray-400">Study Progress</p>
          </div>
          <div>
            <p className="text-white font-semibold">{data.totalHours}h</p>
            <p className="text-xs text-gray-400">Total Study Time</p>
          </div>
          <div>
            <p className="text-white font-semibold">{data.averageScore}/100</p>
            <p className="text-xs text-gray-400">Avg Score</p>
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT - Learning Subjects */}
        <div className="lg:col-span-2 card-dark p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">My Learning</h2>
            <ChevronRight className="text-gray-400 cursor-pointer" />
          </div>

          <div className="h-[260px] overflow-y-auto pr-2">
            {data.learningSubjects.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.learningSubjects.map((item, index) => {
                  const colors = [
                    { card: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", bar: "bg-blue-500" },
                    { card: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", bar: "bg-purple-500" },
                    { card: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", bar: "bg-emerald-500" },
                    { card: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", bar: "bg-orange-500" },
                    { card: "bg-pink-500/10 border-pink-500/20", text: "text-pink-400", bar: "bg-pink-500" },
                    { card: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-400", bar: "bg-cyan-500" }
                  ];
                  const c = colors[index % colors.length];

                  return (
                    <div key={index} className={`rounded-xl p-4 border ${c.card} hover:bg-white/5 transition-colors`}>
                      <p className={`font-bold text-lg ${c.text}`}>
                        {item.name}
                      </p>
                      <p className="text-xs mt-2 text-gray-300">
                        {item.desc}
                      </p>
                      <div className="mt-3 h-[4px] bg-[#1e293b] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bar} rounded-full`}
                          style={{ width: item.progress }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No learning data yet. Start a mock interview to track progress.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CALENDAR */}
        <div className="card-dark p-4 min-h-[300px]">
          <h3 className="text-white text-sm mb-4">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </h3>

          <div className="h-[220px] overflow-y-auto space-y-4 text-xs">
            {[
              ["10:00", "Revise DSA Concepts"],
              ["13:00", "Solve Important Questions"],
              ["15:45", "Practice Mock Test"],
              ["18:00", "Learn System Design Basics"],
              ["20:00", "Review Interview Notes"],
              ["22:00", "Revision Session"],
            ].map(([time, text], i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gray-400 w-12">{time}</span>
                <div className="bg-white/10 px-3 py-2 rounded-lg w-full">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PERFORMANCE SECTION */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

        {/* TOP - Last Test */}
        {data.lastTest ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-green-400 font-medium">
                You completed the test on {data.lastTest.subject}.
              </p>
              <div className="flex gap-6 text-xs text-gray-400 mt-2">
                <span>Attempt Date: {data.lastTest.date}</span>
                <span>Questions: {data.lastTest.total}</span>
              </div>
              <div className="flex gap-6 text-sm mt-3 text-gray-300">
                <span>Score: {data.lastTest.score}</span>
                <span>Correct: {data.lastTest.correct}/{data.lastTest.total}</span>
                <span>Accuracy: {data.lastTest.accuracy}%</span>
              </div>
            </div>

            <div className="w-20 h-20 rounded-full border-4 border-green-400 flex flex-col items-center justify-center text-white">
              <span className="text-xl font-bold">{data.lastTest.score}</span>
              <span className="text-xs text-gray-400">Score</span>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center text-gray-500 text-sm">
            No tests completed yet. Start a mock interview to see your results here.
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Performance */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-sm mb-3">Overall Performance</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Total Sessions: {data.totalSessions}</p>
              <p>Average Score: {data.averageScore}</p>
              <p>Study Hours: {data.totalHours}h</p>
            </div>
            <button
              onClick={() => navigate("/mock/performance")}
              className="mt-4 bg-blue-500 px-3 py-1 rounded text-white text-xs"
            >
              Practice Again
            </button>
          </div>

          {/* Chart */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-sm mb-3">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data.performanceChart}>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Coach */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-sm mb-3">AI Coach</h3>
            <ul className="text-gray-300 text-xs space-y-2">
              {data.aiSuggestions.map((suggestion, i) => (
                <li key={i}>• {suggestion}</li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/aichat")}
              className="mt-4 bg-blue-500 px-3 py-1 rounded text-white text-xs"
            >
              Ask AI
            </button>
          </div>

          {/* Weakest Topics */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-sm mb-3">Weakest Topics</h3>
            {data.weakTopics.map((item, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-gray-300 text-xs">
                  <span>{item.name}</span>
                  <span>{item.score}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded mt-1">
                  <div
                    className={"h-2 rounded " + (item.score < 40 ? "bg-red-400" : item.score < 60 ? "bg-yellow-400" : "bg-green-400")}
                    style={{ width: item.score + "%" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* BOTTOM */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white text-sm mb-3">Key Improvement Suggestions</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            {data.weakTopics.length > 0 ? (
              data.weakTopics.filter((t) => t.score < 60).map((t, i) => (
                <li key={i}>• Focus on improving {t.name.toLowerCase()} (currently {t.score}%)</li>
              ))
            ) : (
              <>
                <li>• Complete mock interviews to get personalized suggestions</li>
                <li>• Practice daily to build consistency</li>
                <li>• Review fundamentals regularly</li>
              </>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default Learning;
