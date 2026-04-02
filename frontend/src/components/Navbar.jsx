import { Search, Mic, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn as checkLogin, getToken } from "../utils/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(checkLogin());

    const handleStorage = () => {
      setLoggedIn(checkLogin());
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(() => {
      setLoggedIn(checkLogin());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-6 h-full bg-[#0f172a] border-b border-white/10 relative z-50">
      <h1 className="text-white font-semibold text-lg">AI Interviewer</h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center bg-[#1e293b] px-4 py-2 rounded-xl w-72 border border-white/10">
          <Search size={17} className="text-gray-400" />
          <input
            className="bg-transparent px-3 w-full text-white outline-none"
            placeholder="Search..."
          />
          <Mic size={18} className="text-gray-400" />
        </div>

        {loggedIn ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-green-400 hover:text-green-300"
          >
            <User size={18} />
            Profile
          </button>
        ) : (
          <button
            onClick={() =>
              navigate("/login", { state: { background: location } })
            }
            className="text-gray-300 hover:text-white"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
