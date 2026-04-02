import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AISection = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Interview Simulation",
      desc: "Real-time AI interviewer with follow-up questions.",
      img: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
      route: "/aichat",
    },
    {
      title: "Personalized AI Mock Test",
      desc: "Based on your selected role.",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      route: "/mock",
    },
    {
      title: "Performance Analytics",
      desc: "Track confidence & improvement.",
      img: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png",
      route: "/analytics",
    },
  ];

  // ✅ SEARCH → go to AIChat with message
  const handleSearch = () => {
    if (!input.trim()) return;

    navigate("/aichat", {
      state: { message: input },
    });

    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-start mt-20 sm:mt-28 lg:mt-32 animate-fadeIn">

      {/* 🔍 SEARCH BAR */}
      <div className="w-full max-w-5xl px-4 mb-12">
        <div className="flex items-center bg-[#1e293b] px-5 py-3 rounded-full border border-white/10 shadow-md">

          <Search size={18} className="text-gray-400" />

          <input
            value={input}
            placeholder="Ask Anything"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="bg-transparent px-3 w-full text-white outline-none"
          />

          <Mic
            size={18}
            className="text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* 📦 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl px-4">

        {features.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.route)}
            className="bg-[#111827] border border-white/10 rounded-xl p-4 cursor-pointer 
                       hover:scale-105 hover:shadow-xl transition"
          >

            <div className="h-32 flex items-center justify-center mb-4 bg-[#0b1220] rounded-lg">
              <img src={item.img} className="h-24" alt={item.title} />
            </div>

            <h3 className="text-white text-sm font-semibold mb-2">
              {item.title}
            </h3>

            <p className="text-gray-400 text-xs">
              {item.desc}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AISection;