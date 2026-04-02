import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeBasedPage = () => {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("Assessment");
  const [codingTime, setCodingTime] = useState("15");
  const [duration, setDuration] = useState("15");

  const [customCoding, setCustomCoding] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [file, setFile] = useState(null);

  const Option = ({ label, value, selected, onClick }) => (
    <div
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm cursor-pointer transition w-full justify-center
      ${
        selected === value
          ? "bg-blue-500/20 border-blue-500"
          : "bg-[#1e293b] border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="w-4 h-4 rounded-full border flex items-center justify-center">
        {selected === value && (
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
      {label}
    </div>
  );

  // ✅ NEXT BUTTON (ONLY LOGIC UPDATED)
  const handleNext = () => {
    if (!file) {
      alert("Please upload your resume first");
      return;
    }

    const finalCoding =
      codingTime === "Custom" ? customCoding || "15" : codingTime;

    const finalDuration =
      duration === "Custom" ? customDuration || "15" : duration;

    const config = {
      type: "resume",
      fileName: file.name,
      difficulty,
      mode,
      codingTime: finalCoding,
      duration: finalDuration,
    };

    navigate("/mock/instructions", {
      state: {
        config,
        from: "/mock/resume", // 🔥 IMPORTANT FIX (NO UI CHANGE)
      },
    });
  };

  return (
    <div className="w-full h-full bg-[#0f172a] text-white px-6 py-4 flex flex-col overflow-y-auto">

      {/* 🔙 HEADER */}
      <div className="flex items-center px-6 py-3 border-b border-white/10 relative">
        <button
          onClick={() => navigate("/mock/performance")}
          className="absolute -left-2 -top-0.5 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold">
            Resume-Based Preparation
          </h1>
          <p className="text-xs text-gray-400">
            Get personalized mock interviews based on your resume
          </p>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="px-6 py-6 space-y-5 pb-20">

        {/* 🔼 UPLOAD SECTION */}
        <div className="flex gap-12 items-center">

          {/* UPLOAD CARD */}
          <div className="bg-[#1e293b] w-[300px] h-[240px] rounded-md border border-white/10 flex flex-col items-center justify-center text-center p-5">

            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>

            <p className="text-xs text-gray-300">
              Drag & drop or click to upload
            </p>

            <p className="text-[11px] text-gray-500 mb-3">
              PDF / DOCX / DOC
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              id="resumeUpload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <label
              htmlFor="resumeUpload"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded text-xs cursor-pointer"
            >
              Upload Resume
            </label>

            {file && (
              <p className="text-[11px] text-green-400 mt-2 truncate w-full">
                {file.name}
              </p>
            )}
          </div>

          {/* RIGHT TEXT */}
          <div>
            <h2 className="text-sm font-semibold mb-2">
              Upload Your Resume
            </h2>

            <p className="text-xs text-gray-400 max-w-md">
              AI will analyze your resume and tailor interview questions based
              on your skills and experience.
            </p>

            <p className="text-xs text-gray-300 mt-2">
              Max. Size: 2MB
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Supported Formats: PDF, DOCX, DOC
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Example: Name, Email, Skills, Projects, Experience
            </p>
          </div>

        </div>

        {/* 🎯 OPTIONS (UNCHANGED) */}

        {/* DIFFICULTY */}
        <div>
          <p className="text-sm mb-2">Difficulty Level</p>
          <div className="grid grid-cols-3 gap-3">
            <Option label="Beginner" value="Beginner" selected={difficulty} onClick={setDifficulty} />
            <Option label="Intermediate" value="Intermediate" selected={difficulty} onClick={setDifficulty} />
            <Option label="Advanced" value="Advanced" selected={difficulty} onClick={setDifficulty} />
          </div>
        </div>

        {/* MODE */}
        <div>
          <p className="text-sm mb-2">Preparation Mode</p>
          <div className="grid grid-cols-4 gap-3">
            <Option label="Assessment" value="Assessment" selected={mode} onClick={setMode} />
            <Option label="Interview" value="Interview" selected={mode} onClick={setMode} />
            <Option label="Technical Round" value="Technical Round" selected={mode} onClick={setMode} />
            <Option label="All" value="All" selected={mode} onClick={setMode} />
          </div>
        </div>

        {/* CODING TIME */}
        <div>
          <p className="text-sm mb-2">Coding Time</p>
          <div className="grid grid-cols-4 gap-3">
            {["15", "30", "45", "Custom"].map((t) => {
              const isCustom = t === "Custom";
              return (
                <div key={t} className="flex flex-col">
                  <Option
                    label={
                      isCustom && customCoding
                        ? `${customCoding} Minutes`
                        : isCustom
                        ? "Custom"
                        : `${t} Minutes`
                    }
                    value={t}
                    selected={codingTime}
                    onClick={setCodingTime}
                  />

                  {codingTime === "Custom" && isCustom && (
                    <input
                      type="number"
                      min="1"
                      value={customCoding}
                      onChange={(e) => setCustomCoding(e.target.value)}
                      className="mt-2 px-3 py-2 text-sm rounded bg-[#0f172a] border border-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DURATION */}
        <div>
          <p className="text-sm mb-2">Duration</p>
          <div className="grid grid-cols-4 gap-3">
            {["15", "30", "45", "Custom"].map((t) => {
              const isCustom = t === "Custom";
              return (
                <div key={t} className="flex flex-col">
                  <Option
                    label={
                      isCustom && customDuration
                        ? `${customDuration} Minutes`
                        : isCustom
                        ? "Custom"
                        : `${t} Minutes`
                    }
                    value={t}
                    selected={duration}
                    onClick={setDuration}
                  />

                  {duration === "Custom" && isCustom && (
                    <input
                      type="number"
                      min="1"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="mt-2 px-3 py-2 text-sm rounded bg-[#0f172a] border border-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded text-sm"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResumeBasedPage;