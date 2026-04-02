import { useNavigate, useLocation } from "react-router-dom";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/profile" },
    { name: "Edit Profile", path: "/edit-profile" },
    { name: "Analytics", path: "/analytics" },
    { name: "Community", path: "/community" },
    { name: "Password", path: "/password" },
    { name: "Log Out", path: "/logout" },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-full flex flex-col">

      <h2 className="text-white font-semibold text-lg mb-6">
        My Profile
      </h2>

      <div className="space-y-2 text-sm flex-1">

        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition
                ${
                  isActive
                    ? "bg-white/10 text-white"
                    : item.name === "Log Out"
                    ? "text-red-400 hover:bg-red-500/20"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {item.name}
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default ProfileSidebar;