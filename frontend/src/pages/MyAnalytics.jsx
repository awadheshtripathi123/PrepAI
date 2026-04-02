import ProfileSidebar from "../components/ProfileSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await authFetch('/api/v1/analytics');
        const data = await res.json();
        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (!analyticsData) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* LEFT PANEL */}
        <div className="sticky top-0 self-start h-[calc(100vh-112px)] overflow-hidden">
          <ProfileSidebar />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 space-y-6">

          <h2 className="text-white text-xl font-semibold">
            Analytics
          </h2>

          {/* TOP CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-md">
              <p className="text-gray-400 text-sm">Total Interviews Taken</p>
              <h3 className="text-white text-3xl font-bold mt-2">{analyticsData.totalInterviews}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Last interview {analyticsData.lastInterviewDate}
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-md">
              <p className="text-gray-400 text-sm">Average Interview Score</p>
              <h3 className="text-white text-3xl font-bold mt-2">{analyticsData.averageScore} / 100</h3>
              <p className="text-green-400 text-sm mt-1">
                ↑ {analyticsData.scoreImprovement}% Improvement from last month
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-md">
              <p className="text-gray-400 text-sm">Strongest Skill Area</p>
              <h3 className="text-white text-lg font-semibold mt-2">
                {analyticsData.strongestSkill}
              </h3>
            </div>
          </div>

          {/* SOFT SKILLS */}
          <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-white font-semibold mb-6">
              Soft Skill Analytics
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {analyticsData.softSkills.map((item, i) => (
                <div key={i} className="bg-[#0b1220] border border-gray-700 rounded-xl p-5">
                  <p className="text-gray-300 text-sm mb-2">{item.title}</p>
                  <h3 className="text-white text-2xl font-bold mb-3">
                    {item.value}%
                  </h3>

                  <div className="h-2 bg-gray-700 rounded mb-4">
                    <div
                      className="h-2 bg-green-400 rounded"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>

                  <div className="space-y-2 text-xs text-gray-400">
                    {item.details.map((d, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{d}</span>
                        <span>80%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-green-400">
                    ✔ {item.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE GRID */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* TECHNICAL */}
            <div className="card-dark p-6 border border-gray-700 rounded-xl">
              <h3 className="text-white mb-4">Technical Skills Performance</h3>
              {analyticsData.technicalSkills.map((s, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{s.name}</span>
                    <span>{s.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded">
                    <div className="h-2 bg-green-400 rounded" style={{width: `${s.score}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {/* DOMAIN */}
            <div className="card-dark p-6 border border-gray-700 rounded-xl">
              <h3 className="text-white mb-4">Domain-Based Performance</h3>
              {analyticsData.domainPerformance.map((s, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{s.name}</span>
                    <span>{s.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded">
                    <div className="h-2 bg-green-400 rounded" style={{width: `${s.score}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {/* HISTORY */}
            <div className="card-dark p-6 border border-gray-700 rounded-xl flex flex-col justify-between h-full lg:col-span-2">
              <h3 className="text-white mb-4 flex items-center gap-2">
                📄 Interview History
              </h3>

              <div className="text-sm text-gray-300">
                <div className="grid grid-cols-5 border-b border-gray-700 pb-2 mb-2 text-gray-400">
                  <span>Date</span>
                  <span>Role</span>
                  <span>Score</span>
                  <span>Level</span>
                  <span>Feedback</span>
                </div>

                {analyticsData.interviewHistory.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-5 items-center py-2 border-b border-gray-800"
                  >
                    <span>{item.date}</span>
                    <span>{item.role}</span>
                    <span>{item.score}</span>
                    <span>{item.level}</span>
                    <span className="text-green-400">✔</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* GRAPH */}
          <div className="bg-[#111827] border border-gray-700 rounded-xl p-6">
            <h3 className="text-white mb-4">Monthly Score Trend</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.monthlyScoreTrend}
                >
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
                  <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔥 BOTTOM FIXED */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 bg-[#111827] border border-gray-700 rounded-xl p-6 h-62 overflow-y-auto">
              {analyticsData.monthlyPerformance.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{item.month}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded">
                    <div
                      className="h-2 bg-green-400 rounded"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="space-y-2">

              <div className="bg-[#111827] border border-gray-300 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 font-semibold mb-2 border-b pb-1">
                    Your AI Readiness
                  </h3>

                  <p className="text-gray-400 text-sm mb-3 max-w-xs">
                    Track your progress with real-time confidence score and performance tracking
                  </p>

                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                    View Detailed Report
                  </button>
                </div>

                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt="AI"
                  className="w-24 h-24 object-contain"
                />
              </div>

              <div className="bg-[#111827] border border-gray-700  rounded-xl p-6">
                <h3 className="text-white mb-2">AI Feedback</h3>
                <p className="text-gray-400 text-sm">
                  {analyticsData.aiFeedback}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Analytics;