import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import { authFetch } from "../utils/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authFetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          console.error(data.error);
          navigate("/login");
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate("/login");
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await authFetch('/api/v1/interview/results');
        const data = await res.json();
        if (data.success) {
          setActivities(data.data.slice(0, 5)); // get top 5 recent results
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    fetchUserData();
    fetchActivities();
  }, [navigate]);

  if (!user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-10 text-white">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* LEFT PANEL */}
        <div className="sticky top-6 self-start h-full">
          <ProfileSidebar />
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* PROFILE HEADER */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-white text-xl font-semibold">
              {user.image ? (
                <img src={user.image} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-white text-lg font-semibold">
                {user.name}
              </h2>
              <p className="text-gray-400 text-sm">
                {user.role}
              </p>
              <p className="text-gray-400 text-sm">
                {user.college || 'Bundelkhand University'}
              </p>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <p><span className="text-gray-400">Full Name:</span> {user.name}</p>
              <p><span className="text-gray-400">DOB:</span> {user.dob || '01/01/2003'}</p>
              <p><span className="text-gray-400">Email:</span> {user.email}</p>
              <p><span className="text-gray-400">Address:</span> {user.address || 'Jhansi, Uttar Pradesh'}</p>
              <p><span className="text-gray-400">Phone:</span> {user.phone || '2642626542'}</p>
              <p><span className="text-gray-400">Department:</span> {user.department || 'Computer Science'}</p>
            </div>
          </div>

          {/* ACADEMIC */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Academic Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <p><span className="text-gray-400">Course:</span> {user.course || 'B.Tech CSE'}</p>
              <p><span className="text-gray-400">Institute:</span> {user.college || 'Bundelkhand University'}</p>
              <p><span className="text-gray-400">Year:</span> {user.year || 'Final Year'}</p>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Recent Activity
            </h3>

            <ul className="text-gray-300 text-sm space-y-3">
              {activities.length > 0 ? (
                activities.map((activity, idx) => (
                  <li 
                    key={activity._id || idx} 
                    className="flex flex-col p-2 bg-white/5 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 duration-200 transition-all group"
                    onClick={() => activity._id && navigate(`/mock/result/${activity._id}`)}
                  >
                    <span className="group-hover:text-white transition-colors">• Completed {activity.mode === 'All' ? 'a comprehensive' : `a ${activity.mode}`} interview for {activity.role}</span>
                    <span className="text-xs text-gray-400 ml-3 mt-1 group-hover:text-gray-300 transition-colors">
                      Score: {activity.overallScore}% | Difficulty: {activity.difficulty}
                      {activity.createdAt && ` | Date: ${new Date(activity.createdAt).toLocaleDateString()}`}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No recent activity.</li>
              )}
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
