import { Home, Book, Bot, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch, isLoggedIn } from "../utils/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn()) {
        setUserImage(null);
        return;
      }
      try {
        const res = await authFetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.success && data.data.image) {
          setUserImage(data.data.image);
        } else {
          setUserImage(null);
        }
      } catch (err) {
        console.error("Failed to fetch user in sidebar", err);
        setUserImage(null);
      }
    };

    fetchUser();

    window.addEventListener('authChange', fetchUser);
    window.addEventListener('storage', fetchUser);
    
    return () => {
      window.removeEventListener('authChange', fetchUser);
      window.removeEventListener('storage', fetchUser);
    };
  }, [location.pathname]);

  const menu = [
    { icon: Home, path: "/" },
    { icon: Book, path: "/learning" },
    { icon: Bot, path: "/ai" },
    { icon: Bell, path: "/notifications" },
  ];

  // ✅ Active route check (handles nested routes properly)
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // ✅ Optimized navigation (no reload if same route)
  const handleNavigate = (path) => {
    // If the path is protected (like notifications) and user is not logged in:
    if (path === "/notifications" && !isLoggedIn()) {
      navigate("/login", { state: { background: location } });
      return;
    }

    if (!isActive(path)) {
      navigate(path);
    }
  };

  // ✅ Profile toggle logic
  const handleProfileClick = () => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { background: location } });
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="w-16 h-screen bg-[#0f172a] border-r border-white/10 flex flex-col items-center py-6">

      {/* LOGO */}
      <div className="mb-10 w-full flex justify-center">
        <img src="/logo.png" alt="PrepAI Sidebar Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
      </div>

      {/* TOP MENU */}
      <div className="flex flex-col items-center gap-10">

        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <div
              key={index}
              onClick={() => handleNavigate(item.path)}
              className="relative cursor-pointer group"
            >
              {/* Active Indicator */}
              {active && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-full"></span>
              )}

              <Icon
                size={20}
                className={`transition ${
                  active
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              />
            </div>
          );
        })}

      </div>

      {/* 🔥 PROFILE ICON */}
      <div className="mt-auto mb-4">
        <div
          onClick={handleProfileClick}
          className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition ${
            location.pathname.startsWith("/profile")
              ? "bg-blue-500 text-white"
              : "bg-gray-600 text-white hover:bg-gray-500"
          }`}
        >
          {userImage ? (
            <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={18} />
          )}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;