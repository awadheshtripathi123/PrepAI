import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const config = location.state?.config;
  const type = location.state?.type;
  const from = location.state?.from;

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  if (!config) {
    return (
      <div className="w-full h-[82vh] flex items-center justify-center text-white">
        No data found
      </div>
    );
  }

  const { role, fileName, difficulty, duration, codingTime, mode } = config;

  const handlePermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: true,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
        };
      }

      setCameraGranted(true);
      setMicGranted(true);
    } catch (error) {
      console.error(error);
      alert("Permission denied. Please allow camera & microphone");
    }
  };

  const showAssessment = mode === "Assessment" || mode === "All";
  const showCoding = mode === "Technical Round" || mode === "All";
  const showHR = mode === "Interview" || mode === "All";

  const handleStart = () => {
    if (!agreed) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (!cameraGranted) {
      alert("Please enable camera & microphone");
      return;
    }

    const flow = [];

    if (mode === "Assessment") flow.push("assessment");
    else if (mode === "Technical Round") flow.push("coding");
    else if (mode === "Interview") flow.push("interview");
    else if (mode === "All") flow.push("assessment", "coding", "interview");

    if (flow.length === 0) {
      alert("Invalid mode");
      return;
    }

    flow.push("result");

    stopStream();
    
    navigate("/mock/" + flow[0], {
      state: { flow, step: 0, config, type },
    });
  };

  const handleBack = () => {
    stopStream();
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (type === "role") navigate("/mock/role", { replace: true });
    else if (type === "resume") navigate("/mock/resume", { replace: true });
    else if (type === "report") navigate("/mock/report", { replace: true });
    else navigate("/mock/performance", { replace: true });
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0b1220] text-white px-6 py-4 flex flex-col pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-center relative mb-3">
        <button onClick={handleBack} className="absolute left-0 top-1 z-50 cursor-pointer bg-transparent border-none">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Instructions</h1>
      </div>

      <p className="text-center text-gray-400 text-sm mb-4">
        Please review the instructions carefully before starting your Preparation
      </p>

      {/* TOP BAR */}
      <div className="bg-[#1e293b] border border-white/10 rounded px-4 py-2 text-sm flex flex-wrap gap-6 mb-4">
        {type === "role" && <span>Role: {role}</span>}
        {type === "resume" && <span>Resume: {fileName}</span>}
        {type === "report" && <span>Report: {fileName}</span>}
        <span>Difficulty: {difficulty}</span>
        <span>Duration: {duration} Minutes</span>
        <span>Coding Time: {codingTime} Minutes</span>
        <span>Mode: {mode}</span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-4 gap-4 flex-1">

        {/* LEFT PANEL */}
        <div className="bg-[#1e293b] border border-white/10 rounded p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-3">Preparation Instructions</h3>

            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Ensure a stable internet connection</li>
              <li>• Sit in a quiet environment</li>
              <li>• Keep your camera at eye level</li>
              <li>• Do not switch tabs or applications</li>
              <li>• Timer will start automatically once you begin</li>
              <li>• Once started, the interview cannot be paused</li>
            </ul>

            <div className="mt-5">
              <h3 className="font-semibold mb-2 text-base">Camera & Microphone Access</h3>
              <p className="text-sm text-gray-400">Camera: {cameraGranted ? "Granted" : "Not Granted"}</p>
              <p className="text-sm text-gray-400">Microphone: {micGranted ? "Granted" : "Not Granted"}</p>
            </div>

            {/* CAMERA PREVIEW */}
            <div className="mt-3 w-full h-[160px] bg-[#111] rounded-lg overflow-hidden relative border border-white/10">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraGranted ? 'block' : 'hidden'}`}
                style={{ transform: "scaleX(-1)" }}
              />
              {!cameraGranted && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <path d="M23 7l-7 5 7 5V7z"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xs">Click Enable to start camera</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handlePermissions}
            disabled={cameraGranted}
            className={"mt-4 px-4 py-2 rounded text-sm font-medium transition " + (
              cameraGranted
                ? "bg-green-600 cursor-default"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {cameraGranted ? "Camera & Mic Enabled" : "Enable Camera & Microphone"}
          </button>
        </div>

        {/* ASSESSMENT */}
        {showAssessment && (
          <div className="bg-[#1e293b] border border-white/10 rounded overflow-hidden">
            <div className="bg-blue-500 text-center py-2 font-semibold text-sm">ASSESSMENT ROUND</div>
            <div className="p-4 text-sm text-gray-300">
              <div className="flex justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <path d="M9 14l2 2 4-4"/>
                </svg>
              </div>
              <ul className="space-y-2">
                <li>MCQ based questions</li>
                <li>15 questions</li>
                <li>1 mark each</li>
              </ul>
            </div>
          </div>
        )}

        {/* CODING */}
        {showCoding && (
          <div className="bg-[#1e293b] border border-white/10 rounded overflow-hidden">
            <div className="bg-orange-500 text-center py-2 font-semibold text-sm">TECHNICAL / CODING ROUND</div>
            <div className="p-4 text-sm text-gray-300">
              <div className="flex justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <ul className="space-y-2">
                <li>Write clean and readable code</li>
                <li>Do not copy from external sources</li>
              </ul>
            </div>
          </div>
        )}

        {/* HR */}
        {showHR && (
          <div className="bg-[#1e293b] border border-white/10 rounded overflow-hidden">
            <div className="bg-green-500 text-center py-2 font-semibold text-sm">HR / INTERVIEW ROUND</div>
            <div className="p-4 text-sm text-gray-300">
              <div className="flex justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <ul className="space-y-2">
                <li>Answer confidently</li>
                <li>Maintain professionalism</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
          <span>I agree to the Terms & Conditions and Privacy Policy</span>
        </div>

        <button
          onClick={handleStart}
          disabled={!agreed || !cameraGranted}
          className={"px-6 py-2 rounded text-sm font-medium transition " + (
            agreed && cameraGranted
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          )}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default Instructions;
