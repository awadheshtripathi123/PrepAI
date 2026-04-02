import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[80vh] bg-[#0f172a] text-white flex items-center justify-center relative ">

      {/* 🔙 BACK ARROW */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4"
        style={{ background: "transparent", border: "none" }}
      >
        <ArrowLeft size={24} />
      </button>

      {/*  COMING SOON TEXT */}
      <h1 className="text-2xl font-semibold text-gray-300">
        Coming Soon!
      </h1>

    </div>
  );
};

export default CommunityPage;