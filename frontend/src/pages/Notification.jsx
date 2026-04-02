import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authFetch("/api/v1/notifications");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getTypeStyles = (type) => {
    if (type === "success") return "bg-green-500/20 text-green-400";
    if (type === "warning") return "bg-yellow-500/20 text-yellow-400";
    return "bg-blue-500/20 text-blue-400";
  };

  const getTypeBadge = (type) => {
    if (type === "success") return "Success";
    if (type === "warning") return "Alert";
    return "New";
  };

  const getTypeIcon = (type) => {
    if (type === "success") {
      return (
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      );
    }
    if (type === "warning") {
      return (
        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white px-6 py-4 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center px-4 py-3 border-b border-white/10 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute -left-4 top-3 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="flex-1">
          <h1 className="text-sm font-semibold">Notifications</h1>
          <p className="text-xs text-gray-400">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((item, index) => (
            <div
              key={index}
              className={`bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start hover:bg-white/10 transition ${
                item.resultId && item.resultType === 'interview' ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 duration-200' : ''
              }`}
              onClick={() => {
                if (item.resultId && item.resultType === 'interview') {
                  navigate(`/mock/result/${item.resultId}`);
                }
              }}
            >
              {getTypeIcon(item.type)}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <span className={"text-[10px] px-2 py-0.5 rounded-full " + getTypeStyles(item.type)}>
                    {getTypeBadge(item.type)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                <p className="text-[10px] text-gray-500 mt-2">{item.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p className="text-sm mt-3">No notifications yet</p>
            <p className="text-xs text-gray-600 mt-1">Complete activities to see updates here</p>
          </div>
        )}
      </div>

      <div className="h-10"></div>
    </div>
  );
};

export default NotificationPage;
