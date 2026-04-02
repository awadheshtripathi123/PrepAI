import ProfileSidebar from "../components/ProfileSidebar";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(null);

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

  const handleConfirm = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await authFetch('/api/v1/auth/updatepassword', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.error || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password.');
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* PROFILE SIDEBAR */}
        <div className="sticky top-0 h-[calc(100vh-112px)]">
          <ProfileSidebar />
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-3 flex justify-center items-start">

          {/* CARD */}
          <div className="bg-[#111827] border border-gray-700 rounded-xl shadow-lg w-full max-w-md p-6 text-center">

            {/* PROFILE ICON */}
            <div className="flex justify-center mb-4 relative">
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden text-white text-xl font-semibold">
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
            <div className="flex justify-center items-center gap-2 mb-5">
              <Lock size={18} className="text-gray-300" />
              <h3 className="text-lg font-semibold text-white">
                Change Password
              </h3>
            </div>

            {/* FORM */}
            <div className="space-y-4 text-left">

              <div>
                <label className="text-sm text-gray-400">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0b1220] border border-gray-600 text-white rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0b1220] border border-gray-600 text-white rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0b1220] border border-gray-600 text-white rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

            </div>

            {/* BUTTON */}
            <div className="mt-6">
              <button
                onClick={handleConfirm}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow">
                Confirm
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChangePassword;
