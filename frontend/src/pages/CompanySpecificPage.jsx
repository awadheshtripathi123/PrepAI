import { ArrowLeft, Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyBasedPage = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("All");
  const [codingTime, setCodingTime] = useState("15");
  const [duration, setDuration] = useState("15");

  const [customCoding, setCustomCoding] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  // ✅ FIXED OPTION BOX (NO OVERFLOW)
  const BoxOption = ({ label, value, selected, onClick }) => (
    <div
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm cursor-pointer transition
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

  // ✅ NEXT BUTTON
  const handleNext = () => {
    if (!company.trim()) {
      alert("Please enter a company");
      return;
    }
    if (!role.trim()) {
      alert("Please enter a role");
      return;
    }

    const finalCoding =
      codingTime === "Custom" ? customCoding || "15" : codingTime;

    const finalDuration =
      duration === "Custom" ? customDuration || "15" : duration;

    const config = {
      type: "company",
      company: company.trim(),
      role: role.trim(),
      difficulty,
      mode,
      codingTime: finalCoding,
      duration: finalDuration,
    };

    navigate("/mock/instructions", {
      state: {
        config,
        from: "/mock/company",
      },
    });
  };

  return (
    <div className="w-full h-full bg-[#0f172a] text-white px-6 py-4 flex flex-col overflow-y-auto">

      {/* 🔙 HEADER */}
      <div className="flex items-center px-6 py-3 border-b border-white/10 relative">

        <button
          onClick={() => navigate("/mock/performance")}
          className="absolute left-0 top-1 z-50 -translate-x-1 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold">
            Company-Based Preparation Mode
          </h1>
          <p className="text-xs text-gray-400">
            Customize your interview based on company and role
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 py-6 space-y-5">

        {/* COMPANY */}
        <div>
          <p className="text-sm mb-2">Company Selection</p>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company"
              className="w-full pl-9 pr-9 py-2 rounded-md bg-[#1e293b] border border-white/10 text-sm focus:outline-none"
            />
            <X
              size={16}
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              onClick={() => setCompany("")}
            />
          </div>

          <div className="mt-2 bg-[#1e293b] border border-white/10 rounded-md px-3 py-2 text-sm">
            {company || "No company selected"}
          </div>
        </div>

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <BoxOption label="Assessment" value="Assessment" selected={mode} onClick={setMode} />
            <BoxOption label="Interview" value="Interview" selected={mode} onClick={setMode} />
            <BoxOption label="Technical Round" value="Technical Round" selected={mode} onClick={setMode} />
            <BoxOption label="All" value="All" selected={mode} onClick={setMode} />
          </div>
        </div>

        {/* CODING TIME */}
        <div>
          <p className="text-sm mb-2">Coding Time</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

export default CompanyBasedPage;