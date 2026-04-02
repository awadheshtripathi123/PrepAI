import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";

const SectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { title, roles } = location.state || {};

  if (!roles) {
    return <div className="text-white p-10">No Data Found ❌</div>;
  }

  return (
    <div className="w-full h-[90vh] bg-[#0f172a] text-white flex flex-col">

      {/* 🔙 HEADER */}
      <div className="flex items-center px-6 py-4 border-b border-white/10 relative">

        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 top-3"
        >
          <ArrowLeft />
        </button>

        <h1 className="w-full text-center text-lg font-semibold">
          {title}
        </h1>

      </div>

      {/* 🔥 SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {roles.map((role, i) => (
            <Card
              key={i}
              title={role.name}
              img={role.img}
              onClick={() =>
                navigate("/mock/card", {
                  state: {
                    role: role.name,
                    img: role.img,
                  },
                })
              }
            />
          ))}

        </div>

      </div>

    </div>
  );
};

export default SectionPage;