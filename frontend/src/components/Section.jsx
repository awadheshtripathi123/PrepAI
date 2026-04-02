import Card from "./Card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Section = ({ title, roles = [] }) => {
  const navigate = useNavigate();

  // ✅ HANDLE NAVIGATION
  const handleCardClick = (role) => {
    navigate("/mock/card", {
      state: {
        role: role.name,
        img: role.img,
      },
    });
  };

  return (
    <div className="card-dark p-5 min-h-[260px]">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white font-semibold text-lg md:text-xl lg:text-2xl">
          {title}
        </h2>

        <button
          onClick={() =>
            navigate("/section", {
              state: {
                title,
                roles,
              },
            })
          }
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full hover:scale-105 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div> {/* ✅ FIXED (IMPORTANT) */}

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">

        {roles.length > 0 ? (
          roles.map((role, i) => (
            <Card
              key={i}
              title={role.name}
              img={role.img}
              onClick={() => handleCardClick(role)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No roles available
          </p>
        )}

      </div>

    </div>
  );
};

export default Section;