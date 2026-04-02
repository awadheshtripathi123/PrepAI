import { ArrowLeft, Briefcase, FileText, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PerformancePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Role-Based Preparation",
      desc: "Questions based on selected job role",
      icon: <Briefcase size={18} />,
      path: "/mock/role",
    },
    {
      title: "Report-Based Preparation",
      desc: "Turn performance into insights",
      icon: <FileText size={18} />,
      path: "/mock/report",
    },
    {
      title: "Resume-Based Preparation",
      desc: "AI asks from your projects",
      icon: <User size={18} />,
      path: "/mock/resume", // ✅ FIXED
    },
    {
      title: "Company-Specific Mock",
      desc: "Google / Amazon / TCS level prep",
      icon: <Building2 size={18} />,
      path: "/mock/company", // optional future
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f172a] p-6 text-white">

      {/* 🔙 BACK BUTTON */}
      <div className="relative">
        <button
          onClick={() => navigate("/mock")}
          className="absolute top-0 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8 items-stretch">

        {/* 🔥 LEFT */}
        <div className="bg-[#1e293b] rounded-lg p-5 border border-white/10 flex flex-col h-full">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Personalization Features
          </h2>

          <div className="flex flex-col gap-4 flex-1">

            {features.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)} // ✅ CLEAN NAVIGATION
                className="flex items-center gap-4 flex-1 min-h-0 bg-gradient-to-r from-[#0f172a] to-[#020617] border border-white/10 rounded-lg px-4 py-3 hover:scale-[1.02] hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
              >
                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                  {item.icon}
                </div>

                {/* TEXT */}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* 🔥 RIGHT SIDE (UNCHANGED) */}
        <div className="bg-[#1e293b] rounded-lg p-5 border border-white/10">

          <h2 className="text-lg font-semibold mb-4">
            After Mock Test - Performance
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-[#0f172a] border border-white/10 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Your Score Breakdown:
              </h3>

              <div className="space-y-2 text-sm">
                {[
                  ["Technical Knowledge", "8.2/10"],
                  ["Communication", "7.5/10"],
                  ["Problem Solving", "8.7/10"],
                  ["Confidence Level", "6.7/10"],
                  ["Logical Thinking", "8.5/10"],
                  ["Time Management", "8.0/10"]
                ].map(([t, s], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300">✔ {t}</span>
                    <span className="text-white font-medium">{s}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/mock")}
                className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm"
              >
                Retake Interview
              </button>
            </div>

            <div className="bg-[#0f172a] border border-white/10 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Total Score Earned
              </h3>

              <div className="space-y-2 text-sm">
                {[
                  ["Technical Knowledge", "8.2/10"],
                  ["Communication", "7.5/10"],
                  ["Problem Solving", "8.7/10"],
                  ["Confidence Level", "6.7/10"],
                  ["Logical Thinking", "8.5/10"],
                  ["Time Management", "8.0/10"]
                ].map(([t, s], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300">✔ {t}</span>
                    <span className="text-white font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#0f172a] border border-white/10 rounded-md p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              AI Suggestion:
            </h3>

            <ul className="text-sm text-gray-400 list-disc ml-5 space-y-1">
              <li>Improve explanation clarity</li>
              <li>Practice DSA medium problem</li>
              <li>Use Structured answer (STAR method)</li>
            </ul>
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-1 h-[1px] bg-white/20" />
          <p className="mx-4 text-gray-300 font-medium">
            Why Choose Our Personalized AI?
          </p>
          <div className="flex-1 h-[1px] bg-white/20" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
          <p>✔ Smart adaptive questioning</p>
          <p>✔ Real company-level difficulty</p>
          <p>✔ Performance analytics dashboard</p>
          <p>✔ 24/7 unlimited practice</p>
          <p>✔ Resume-based AI analysis</p>
          <p>✔ Personalization Features</p>
        </div>
      </div>

    </div>
  );
};

export default PerformancePage;