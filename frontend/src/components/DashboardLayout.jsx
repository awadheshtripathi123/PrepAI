import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const [showFooter, setShowFooter] = useState(false);

  // 🔥 Show footer when mouse near bottom
  const handleMouseMove = (e) => {
    if (window.innerHeight - e.clientY < 60) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  };

  // 🔥 Show footer when scroll reaches bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setShowFooter(true);
    }
  };

  return (
    <div
      className="h-screen flex bg-[#0b1220] overflow-hidden text-white"
      onMouseMove={handleMouseMove}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative">

        {/* NAVBAR */}
        <div className="h-16 border-b border-white/10">
          <Navbar />
        </div>

        {/* 🔥 CONTENT AREA */}
        <div
          className="flex-1 overflow-y-auto p-6 pb-20 space-y-6"
          onScroll={handleScroll}
        >
          <Outlet />
        </div>

        {/* 🔥 FOOTER (SMOOTH + FIXED WIDTH) */}
        <div
          className={`fixed bottom-0 left-[64px] right-0 z-40 transition-all duration-300 ${
            showFooter ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;