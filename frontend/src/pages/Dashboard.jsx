import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const Dashboard = () => {
  const [showFooter, setShowFooter] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // 🔥 Footer show on mouse near bottom
  const handleMouseMove = (e) => {
    if (window.innerHeight - e.clientY < 80) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  };

  // 🔥 Footer show on scroll bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setShowFooter(true);
    }
  };

  return (
    <div
      className="h-screen flex bg-[#0b1220] overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* 🌌 Background */}
      <div className="gradient-bg"></div>

      {/* 🔥 MAIN APP */}
      <div className={`flex w-full h-full ${authMode ? "blur-md pointer-events-none" : ""}`}>

        {/* SIDEBAR */}
        <Sidebar />

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col">

          {/* NAVBAR */}
          <Navbar
            isLoggedIn={!!user}
          />

          {/* ROUTE CONTENT */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6 animate-fadeIn"
            onScroll={handleScroll}
          >
            <Outlet />
          </div>

          {/* FOOTER */}
          {showFooter && (
            <div className="fixed bottom-0 left-16 right-0 z-40 animate-slideUp">
              <Footer />
            </div>
          )}
        </div>
      </div>

      {/* 🔐 AUTH MODAL */}
      {authMode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay (FIXED) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAuthMode(null)} // ✅ WORKING NOW
          ></div>

          {/* Modal */}
          <div className="relative z-[10000] animate-scaleIn flex items-center justify-center w-full h-full">

            {authMode === "login" ? (
              <LoginPage
                onClose={() => setAuthMode(null)}
                onSwitch={() => setAuthMode("signup")}
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  setAuthMode(null);
                }}
              />
            ) : (
              <SignupPage
                onClose={() => setAuthMode(null)}
                onSwitch={() => setAuthMode("login")}
              />
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;