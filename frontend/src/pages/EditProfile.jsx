import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    gender: '',
    userType: '',
    domain: '',
    course: '',
    courseSpecialization: '',
    courseDurationStart: '',
    courseDurationEnd: '',
    college: '',
    year: '',
    address: '',
    image: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authFetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.success) {
          const user = data.data;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            phone: user.phone || '',
            gender: user.gender || '',
            userType: user.userType || '',
            domain: user.domain || '',
            course: user.course || '',
            courseSpecialization: user.courseSpecialization || '',
            courseDurationStart: user.courseDuration?.start || '',
            courseDurationEnd: user.courseDuration?.end || '',
            college: user.college || '',
            year: user.year || '',
            address: user.address || '',
            image: user.image || null,
          });
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const body = {
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        phone: formData.phone,
        gender: formData.gender,
        userType: formData.userType,
        domain: formData.domain,
        course: formData.course,
        courseSpecialization: formData.courseSpecialization,
        courseDuration: {
          start: formData.courseDurationStart,
          end: formData.courseDurationEnd
        },
        college: formData.college,
        year: formData.year,
        address: formData.address,
        image: formData.image
      };

      const res = await authFetch('/api/v1/auth/updatedetails', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/profile";
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

        {/* LEFT PANEL */}
        <div className="sticky top-6 self-start h-[calc(100vh-112px)]">
          <ProfileSidebar />
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl flex">

          {/* IMAGE SECTION */}
          <div className="w-[260px] border-r border-white/10 flex flex-col items-center py-10">

            <h2 className="text-white text-lg font-semibold mb-6">
              Edit Profile
            </h2>

            <div className="relative">

              {/* IMAGE */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600">
                {formData.image && (
                  <img
                    src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* INPUT */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="upload-image"
              />

              {/* CAMERA */}
              <label
                htmlFor="upload-image"
                className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white cursor-pointer hover:scale-105 transition"
              >
                📷
              </label>

            </div>

          </div>

          {/* FORM */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[80vh] space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name*</label>
                <input className="input w-full" name="name" value={formData.name} onChange={handleChange}/>
              </div>

              <div>
                <label className="label">Email*</label>
                <input className="input w-full" name="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">DOB*</label>
              <input type="date" className="input w-full" name="dob" value={formData.dob} onChange={handleChange} />
            </div>

            <div>
              <label className="label">Mobile*</label>
              <input className="input w-full" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            {/* GENDER */}
            <div>
              <label className="label">Gender*</label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`px-4 py-2 rounded-full border cursor-pointer transition active:scale-95
                      ${
                        formData.gender === g
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white/10 text-gray-300 border-white/10 hover:bg-white/20"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* USER TYPE */}
            <div>
              <label className="label">User Type*</label>
              <div className="flex flex-wrap gap-2">
                {["College Student", "Professional", "School Student", "Fresher"].map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setFormData({ ...formData, userType: u })}
                    className={`px-4 py-2 rounded-full border cursor-pointer transition active:scale-95
                      ${
                        formData.userType === u
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white/10 text-gray-300 border-white/10 hover:bg-white/20"
                      }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* DOMAIN */}
            <div>
              <label className="label">Domain*</label>
              <div className="flex flex-wrap gap-2">
                {["Management", "Engineering", "Art & Science", "Medical", "Law", "Other"].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setFormData({ ...formData, domain: d })}
                    className={`px-4 py-2 rounded-full border cursor-pointer transition active:scale-95
                      ${
                        formData.domain === d
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white/10 text-gray-300 border-white/10 hover:bg-white/20"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Course*</label>
              <select className="input w-full" name="course" value={formData.course} onChange={handleChange}>
                <option>B.Tech/B.E.</option>
              </select>
            </div>

            <div>
              <label className="label">Course Specialization*</label>
              <select className="input w-full" name="courseSpecialization" value={formData.courseSpecialization} onChange={handleChange}>
                <option>Computer Science and Engineering</option>
              </select>
            </div>

            <div>
              <label className="label">Course Duration*</label>
              <div className="flex gap-4">
                <input className="input w-24" placeholder="2022" name="courseDurationStart" value={formData.courseDurationStart} onChange={handleChange} />
                <input className="input w-24" placeholder="2026" name="courseDurationEnd" value={formData.courseDurationEnd} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">Organization/College*</label>
              <input className="input w-full" name="college" value={formData.college} onChange={handleChange} placeholder="Enter College Name" />
            </div>

            <div>
              <label className="label">Year*</label>
              <input className="input w-full" name="year" value={formData.year} onChange={handleChange} />
            </div>

            <div>
              <label className="label">Address*</label>
              <input className="input w-full" name="address" value={formData.address} onChange={handleChange} />
            </div>

            {/* SAVE */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white"
              >
                Save
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EditProfile;
