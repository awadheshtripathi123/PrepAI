import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { authFetch, removeToken } from "../utils/api";

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(null);

  const isModal = location.state?.background;

  const handleCancel = () => {
    if (isModal) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.success) {
          setUserName(data.data.name);
          setUserImage(data.data.image);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCancel();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authFetch('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    removeToken();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* ✅ BLUR BACKGROUND */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={handleCancel}
      />

      {/* ✅ MODAL */}
      <div className="relative z-10 w-[380px] rounded-2xl bg-[#111827] border border-gray-700 p-6 shadow-2xl text-center">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* PROFILE ICON */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-gray-600 rounded-full border-2 border-gray-700 flex items-center justify-center overflow-hidden text-white text-xl font-semibold">
            {userImage ? (
              <img src={userImage} alt="profile" className="w-full h-full object-cover" />
            ) : (
              userName ? userName.charAt(0).toUpperCase() : 'U'
            )}
          </div>
        </div>

        {/* NAME */}
        <h2 className="text-white font-semibold mb-3">
          {userName || 'User'}
        </h2>

        {/* TITLE */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <LogOut size={18} className="text-gray-300" />
          <h3 className="text-lg font-semibold text-white">
            Log Out
          </h3>
        </div>

        {/* TEXT */}
        <p className="text-gray-400 text-sm mb-2">
          Are you sure you want to log out of your account?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          You can log back in anytime
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default LogoutPage;