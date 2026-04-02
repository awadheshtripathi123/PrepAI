import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  // ✅ HANDLE FILE CHANGE (VALIDATION ADDED)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // 🔥 FILE SIZE CHECK (2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    setFile(selectedFile);
  };

  // ✅ HANDLE NEXT
  const handleNext = () => {
    if (!file) {
      alert("Please upload your report first");
      return;
    }

    const config = {
      type: "report",
      fileName: file.name,
    };

    navigate("/mock/instructions", {
      state: {
        config,
        from: "/mock/report", // 🔥 IMPORTANT (for back button)
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col text-white">

      {/* 🔙 HEADER */}
      <div className="flex items-center px-6 py-3 border-b border-white/10 relative">
        <button
          onClick={() => navigate("/mock/performance")}
          className="absolute -left-2 -top-0.5 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold">
            Report Analysis With AI
          </h1>
          <p className="text-xs text-gray-400">
            Upload your interview report and get AI-based insights
          </p>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="flex-1 flex items-center justify-center gap-20 px-6">

        {/* 📤 UPLOAD CARD */}
        <div className="bg-[#1e293b] w-[320px] h-[270px] rounded-md border border-white/10 shadow flex flex-col items-center justify-center text-center p-6">

          {/* ICON */}
          <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
          </div>

          <p className="text-xs text-gray-300">
            Drag & drop or click to upload
          </p>

          <p className="text-[11px] text-gray-500 mb-4">
            PDF / DOCX / DOC
          </p>

          {/* FILE INPUT */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            id="reportUpload"
            className="hidden"
            onChange={handleFileChange}
          />

          <label
            htmlFor="reportUpload"
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-xs shadow cursor-pointer"
          >
            Upload Report
          </label>

          {/* FILE NAME */}
          {file && (
            <p className="text-[11px] text-green-400 mt-2 truncate w-full">
              {file.name}
            </p>
          )}
        </div>

        {/* 📄 RIGHT TEXT */}
        <div className="text-left">
          <h2 className="text-sm font-semibold mb-2">
            Upload Your Report
          </h2>

          <p className="text-xs text-gray-400">
            Drag & drop or click to upload
          </p>

          <p className="text-xs text-gray-300 mt-1">
            Max. Size: 2MB
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Supported Formats: PDF, DOCX, DOC
          </p>
        </div>
      </div>

      {/* 👉 BUTTON */}
      <div className="flex justify-end px-6 pb-4">
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded text-sm shadow"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ReportPage;