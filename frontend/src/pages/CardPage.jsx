import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "Software Developer";
  const img = location.state?.img;

  // ✅ STATE
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("All"); // 🔥 default All
  const [codingTime, setCodingTime] = useState("15");
  const [duration, setDuration] = useState("15");

  const [customCoding, setCustomCoding] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  // ✅ BOX OPTION
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

  // ✅ NEXT BUTTON
  const handleNext = () => {
    const finalCoding =
      codingTime === "Custom" ? customCoding || "15" : codingTime;

    const finalDuration =
      duration === "Custom" ? customDuration || "15" : duration;

    const config = {
      role,
      difficulty,
      mode,
      codingTime: finalCoding,
      duration: finalDuration,
      fileName: "N/A",
    };

    navigate("/mock/instructions", {
      state: {
        config,
        type: "role",
        from: "/mock/card",
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white px-8 py-6">

      {/* 🔙 BACK ARROW */}
      <div className="relative mb-4">
        <button
          onClick={() => navigate("/")}
          className="absolute -left-5 -top-3 cursor-pointer"
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ArrowLeft size={22} />
        </button>
      </div>

      {/* TITLE */}
      <h1 className="text-xl font-semibold mb-6">{role}</h1>

      {/* TOP */}
      <div className="flex gap-6 mb-6">

        {/* LEFT CARD */}
        <div className="w-48 bg-[#1e293b] rounded-xl p-4 border border-white/10 text-center">
          <img
            src={
              img ||
              "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            }
            className="w-20 h-20 mx-auto mb-3"
            alt="role"
          />
          <p className="text-sm text-pink-400 font-medium">{role}</p>
        </div>

        {/* DESCRIPTION */}
        <div className="flex-1 text-sm text-gray-300">
          <p className="mb-3">
            You will be evaluated on DSA, OOP, APIs, debugging and clean coding.
          </p>
        </div>

      </div>

      {/* OPTIONS */}
      <div className="space-y-5">

        {/* DIFFICULTY */}
        <div>
          <p className="text-sm mb-2">Difficulty Level</p>
          <div className="grid grid-cols-3 gap-3">
            <BoxOption label="Beginner" value="Beginner" selected={difficulty} onClick={setDifficulty} />
            <BoxOption label="Intermediate" value="Intermediate" selected={difficulty} onClick={setDifficulty} />
            <BoxOption label="Advanced" value="Advanced" selected={difficulty} onClick={setDifficulty} />
          </div>
        </div>

        {/* 🔥 MODE (UPDATED WITH ALL) */}
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
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="mt-2 px-3 py-2 text-sm rounded bg-[#0f172a] border border-blue-500"
                    />
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded text-sm"
        >
          Next →
        </button>
      </div>

    </div>
  );
};

export default CardPage;