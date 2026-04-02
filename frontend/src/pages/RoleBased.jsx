import { ArrowLeft, Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("All");
  const [codingTime, setCodingTime] = useState("15");
  const [duration, setDuration] = useState("15");

  const [customCoding, setCustomCoding] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  const BoxOption = ({ label, value, selected, onClick }) => (
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

  // ✅ NEXT BUTTON (UPDATED WITH TYPE)
  const handleNext = () => {
    if (!role.trim()) {
      alert("Please enter a role");
      return;
    }

    const finalCoding =
      codingTime === "Custom" ? customCoding || "15" : codingTime;

    const finalDuration =
      duration === "Custom" ? customDuration || "15" : duration;

    const config = {
      role: role.trim(),
      difficulty,
      mode,
      codingTime: finalCoding,
      duration: finalDuration,
    };

    navigate("/mock/instructions", {
      state: { 
        config,
        type: "role", // 🔥 ADDED (IMPORTANT)
      },
    });
  };

  return (
    <div className="w-full h-[90vh] bg-[#0f172a] text-white px-6 py-4 flex flex-col overflow-hidden">

      {/* 🔙 HEADER */}
      <div className="flex items-center px-6 py-3 border-b border-white/10 relative">

        <button
          onClick={() => navigate("/mock/performance")}
          className="absolute -left-2 -top-0.5 cursor-pointer z-50"
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold">
            Role-Based Preparation Mode
          </h1>
          <p className="text-xs text-gray-400">
            Customize your interview experience based on role and difficulty
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 py-6 space-y-5">

        {/* ROLE */}
        <div>
          <p className="text-sm mb-2">Role Selection</p>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter role"
              className="w-full pl-9 pr-9 py-2 rounded-md bg-[#1e293b] border border-white/10 text-sm focus:outline-none"
            />
            <X
              size={16}
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              onClick={() => setRole("")}
            />
          </div>

          <div className="mt-2 bg-[#1e293b] border border-white/10 rounded-md px-3 py-2 text-sm">
            {role || "No role selected"}
          </div>
        </div>

        {/* DIFFICULTY */}
        <div>
          <p className="text-sm mb-2">Difficulty Level</p>

          <div className="grid grid-cols-3 gap-3">
            <BoxOption label="Beginner" value="Beginner" selected={difficulty} onClick={setDifficulty} />
            <BoxOption label="Intermediate" value="Intermediate" selected={difficulty} onClick={setDifficulty} />
            <BoxOption label="Advanced" value="Advanced" selected={difficulty} onClick={setDifficulty} />
          </div>
        </div>

        {/* MODE */}
        <div>
          <p className="text-sm mb-2">Preparation Mode</p>

          <div className="grid grid-cols-4 gap-3">
            <BoxOption label="Assessment" value="Assessment" selected={mode} onClick={setMode} />
            <BoxOption label="Interview" value="Interview" selected={mode} onClick={setMode} />
            <BoxOption label="Technical Round" value="Technical Round" selected={mode} onClick={setMode} />
            <BoxOption label="All" value="All" selected={mode} onClick={setMode} />
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

                  <BoxOption
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
                      placeholder="Enter minutes"
                      value={customCoding}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || Number(val) > 0) {
                          setCustomCoding(val);
                        }
                      }}
                      className="mt-2 px-3 py-2 text-sm rounded bg-[#0f172a] border border-blue-500 focus:outline-none"
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

                  <BoxOption
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
                      placeholder="Enter minutes"
                      value={customDuration}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || Number(val) > 0) {
                          setCustomDuration(val);
                        }
                      }}
                      className="mt-2 px-3 py-2 text-sm rounded bg-[#0f172a] border border-blue-500 focus:outline-none"
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

export default RoleBasedPage;