import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MockInterview = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-hidden space-y-6">

      {/* 🔥 HERO SECTION */}
      <div className="card-dark px-6 py-6 relative flex flex-col lg:flex-row justify-between items-center gap-6 overflow-hidden">

        {/* 🔙 BACK */}
        <button
          onClick={() => navigate("/ai")}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* LEFT */}
        <div className="max-w-[500px] w-full">
          <h1 className="text-3xl font-semibold text-white leading-snug">
            Personalized AI Mock Preparation <br />
            - Built Just for you
          </h1>

          <p className="text-gray-400 text-sm mt-3">
            Practice real interview questions tailored to your role,
            experience level, and tech stack.
          </p>

          <button
            onClick={() => navigate("/mock/performance")}
            className="mt-5 btn-primary px-5 py-2 text-sm"
          >
            Start Personalized Interview
          </button>
        </div>

        {/* IMAGE */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          className="w-[220px] lg:w-[240px] max-w-full object-contain opacity-90"
          alt="mock interview"
        />
      </div>

      {/* 🔥 HOW IT WORKS */}
      <div className="card-dark px-6 py-6 overflow-hidden">

        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-[1px] bg-gray-700" />
          <p className="mx-4 text-gray-300 text-sm font-medium whitespace-nowrap">
            How It Works
          </p>
          <div className="flex-1 h-[1px] bg-gray-700" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">

          {/* STEP 1 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm">
                1
              </span>
              <h3 className="text-white font-semibold">
                Choose Your Profile
              </h3>
            </div>

            <div className="space-y-2">
              {[
                "Frontend Developer",
                "1-3 Years",
                "Level - Advanced",
                "Mode - Assessment"
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/mock/role")}
                  className="bg-white/5 border border-white/10 p-2 rounded cursor-pointer hover:bg-white/10 transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-4">
              AI Generates Smart Questions
            </h3>
            <div className="bg-white/5 border border-white/10 rounded p-4 text-gray-400 text-sm">
              Questions will be generated based on your role,
              experience, and difficulty.
            </div>
          </div>

          {/* STEP 3 */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-4">
              Real-Time AI Feedback
            </h3>

            <div className="space-y-2">
              <div className="bg-white/5 p-3 rounded">✔ Communication score</div>
              <div className="bg-white/5 p-3 rounded">✔ Technical accuracy</div>
              <div className="bg-white/5 p-3 rounded">✔ Confidence analysis</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default MockInterview;