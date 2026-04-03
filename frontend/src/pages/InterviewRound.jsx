import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authFetch } from "../utils/api";

const InterviewRound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state) {
    return <div className="text-white p-10">No Data Found</div>;
  }

  const { flow, step, config } = location.state;
  const role = config?.role || "Software Developer";
  const difficulty = config?.difficulty || "Intermediate";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDictating, setIsDictating] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const candidateAnswerRef = useRef(candidateAnswer);
  const isDictatingRef = useRef(isDictating);
  const aiLoadingRef = useRef(aiLoading);
  const submittedRef = useRef(submitted);

  useEffect(() => { candidateAnswerRef.current = candidateAnswer; }, [candidateAnswer]);
  useEffect(() => { isDictatingRef.current = isDictating; }, [isDictating]);
  useEffect(() => { aiLoadingRef.current = aiLoading; }, [aiLoading]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDictatingRef.current && !aiLoadingRef.current && !submittedRef.current && candidateAnswerRef.current.trim().length > 0) {
        const timeSinceLastSpeech = Date.now() - lastSpeechTimeRef.current;
        if (timeSinceLastSpeech >= 10000) {
          const btn = document.getElementById("submit-answer-btn");
          if (btn && !btn.disabled) {
            btn.click();
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopStream();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: true,
      });
      streamRef.current = mediaStream;
      setCameraReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
        };
      }
    } catch (error) {
      console.error("Camera access failed:", error);
      setCameraReady(false);
    }
  }, [stopStream]);

  // Fetch AI questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await authFetch(
          `/api/v1/interview/questions?role=${encodeURIComponent(role)}&difficulty=${encodeURIComponent(difficulty)}`
        );
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setQuestions(data.data);
          setCurrentQuestion(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    return () => stopStream();
  }, []);

  // Mic toggle
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = micOn;
      });
    }
  }, [micOn]);

  // Camera toggle
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = camOn;
      });
    }
    if (camOn && !streamRef.current) startCamera();
  }, [camOn, startCamera]);

  // Text-To-Speech (Bot speaking)
  useEffect(() => {
    if (currentQuestion && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.rate = 0.95; // Slightly slower for natural feel
      utterance.onstart = () => {
        setIsSpeaking(true);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
            setIsDictating(false);
          } catch (e) {}
        }
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsDictating(true);
            lastSpeechTimeRef.current = Date.now();
          } catch (e) {}
        }
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentQuestion]);

  // Speech-To-Text (User Dictation) Initialization
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      // Use interim results strictly for reset timer tracking, ignore non-final text
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        lastSpeechTimeRef.current = Date.now();
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCandidateAnswer((prev) => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + finalTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsDictating(false);
      };

      recognitionRef.current.onend = () => {
        setIsDictating(false);
      };
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Please try Chrome.");
      return;
    }
    if (isDictating) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsDictating(true);
        lastSpeechTimeRef.current = Date.now();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Navigate to next flow
  const handleNext = useCallback(() => {
    stopStream();
    const nextStep = step + 1;
    if (nextStep >= flow.length) return;
    
    // Calculate final average score
    const avgScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length)
      : 0;

    navigate("/mock/" + flow[nextStep], {
      state: { 
        flow, 
        step: nextStep, 
        config: { ...config, interviewScore: avgScore, interviewEvaluations: evaluations } 
      },
    });
  }, [stopStream, step, flow, config, navigate, evaluations]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return min + ":" + (sec < 10 ? "0" : "") + sec;
  };

  // Submit answer and get next AI question
  const handleNextQuestion = async () => {
    if (!candidateAnswer.trim()) {
      alert("Please provide an answer before moving to the next question.");
      return;
    }

    if (recognitionRef.current && isDictating) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    setSubmitted(true);
    setAiLoading(true);

    try {
      // Evaluate current answer
      const evalRes = await authFetch("/api/v1/interview/evaluate", {
        method: "POST",
        body: JSON.stringify({
          role,
          question: currentQuestion,
          answer: candidateAnswer,
        }),
      });
      const evalData = await evalRes.json();
      if (evalData.success) {
        setEvaluations((prev) => [
          ...prev, 
          {
            question: currentQuestion,
            answer: candidateAnswer,
            score: evalData.data.score,
            feedback: evalData.data.feedback
          }
        ]);
      }

      // Get next AI question based on answer
      const nextRes = await authFetch("/api/v1/interview/next-question", {
        method: "POST",
        body: JSON.stringify({
          role,
          previousQuestion: currentQuestion,
          previousAnswer: candidateAnswer,
        }),
      });
      const nextData = await nextRes.json();

      if (nextData.success) {
        if (currentQ < 15) {
          setCurrentQ((prev) => prev + 1);
          setCurrentQuestion(nextData.data.question);
          setCandidateAnswer("");
          setSubmitted(false);
        } else {
          handleNext();
        }
      } else {
        // Fallback to preloaded questions
        if (currentQ - 1 < questions.length) {
          setCurrentQuestion(questions[currentQ]);
          setCurrentQ((prev) => prev + 1);
          setCandidateAnswer("");
          setSubmitted(false);
        } else {
          handleNext();
        }
      }
    } catch (error) {
      console.error("Failed to get next question:", error);
      // Fallback
      if (currentQ < questions.length) {
        setCurrentQuestion(questions[currentQ]);
        setCurrentQ((prev) => prev + 1);
        setCandidateAnswer("");
        setSubmitted(false);
      } else {
        handleNext();
      }
    } finally {
      setAiLoading(false);
    }
  };

  const avgScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((sum, e) => sum + (e.score || 0), 0) /
            evaluations.length
        )
      : 0;

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Preparing AI Interview for {role}...</p>
          <p className="text-gray-500 text-xs mt-1">Difficulty: {difficulty}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4">
      <div className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-lg mb-3">
        <div>
          <h2 className="text-lg font-semibold">Interview Round</h2>
          <span className="text-xs text-gray-400">{role} - {difficulty}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-black px-3 py-1 rounded text-sm">{formatTime()}</span>
          <span className="bg-black px-3 py-1 rounded text-sm">Q {currentQ}/15</span>
          {evaluations.length > 0 && (
            <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded text-sm">
              Avg: {avgScore}%
            </span>
          )}
          <button onClick={handleNext} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm">
            End Interview
          </button>
        </div>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 280px)" }}>
        {/* LEFT - QUESTION */}
        <div className="w-[40%] bg-[#2a2a2a] p-6 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Question {currentQ}</h3>
              {aiLoading && (
                <span className="text-blue-400 text-xs animate-pulse">AI is thinking...</span>
              )}
            </div>

            <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
              <p className="text-gray-200 text-base leading-relaxed">
                {aiLoading ? "Generating next question..." : currentQuestion}
              </p>
            </div>

            {/* EVALUATION FEEDBACK */}
            {evaluations.length > 0 && !submitted && (
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 mb-4 max-h-24 overflow-y-auto">
                <p className="text-gray-400 text-xs mb-1">Previous evaluation:</p>
                <div className="flex items-start gap-2">
                  <span className={"text-sm font-bold mt-0.5 " + (evaluations[evaluations.length - 1].score >= 60 ? "text-green-400" : "text-yellow-400")}>
                    {evaluations[evaluations.length - 1].score}%
                  </span>
                  <span className="text-gray-400 text-xs leading-relaxed">
                    {evaluations[evaluations.length - 1].feedback}
                  </span>
                </div>
              </div>
            )}

            {/* ANSWER INPUT */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm block">Your Answer:</label>
                <button
                  onClick={toggleDictation}
                  disabled={submitted || aiLoading}
                  className={"text-xs px-3 py-1 rounded flex items-center gap-1 transition-colors " +
                    (isDictating ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30")
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isDictating ? (
                      <><rect x="6" y="6" width="12" height="12" rx="2" /></>
                    ) : (
                      <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></>
                    )}
                  </svg>
                  {isDictating ? "Stop Dictating" : "Dictate Answer"}
                </button>
              </div>
              <textarea
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={submitted || aiLoading}
                className="w-full h-32 bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-3">
              <button
                onClick={() => setMicOn((prev) => !prev)}
                className={"p-3 rounded-full transition " + (micOn ? "bg-green-500" : "bg-red-500")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  {micOn ? (
                    <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
                  ) : (
                    <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>
                  )}
                </svg>
              </button>
              <button
                onClick={() => setCamOn((prev) => !prev)}
                className={"p-3 rounded-full transition " + (camOn ? "bg-green-500" : "bg-red-500")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  {camOn ? (
                    <><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>
                  ) : (
                    <><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/></>
                  )}
                </svg>
              </button>
            </div>

            <button
              id="submit-answer-btn"
              onClick={handleNextQuestion}
              disabled={aiLoading || submitted}
              className={"px-6 py-2 rounded-lg text-sm font-medium transition " +
                (aiLoading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600")
              }
            >
              {aiLoading ? "Loading..." : currentQ >= 15 ? "Finish Interview" : "Next Question"}
            </button>
          </div>
        </div>

        {/* RIGHT - VIDEO AREA */}
        <div className="flex-1 bg-[#2a2a2a] rounded-lg flex flex-col items-center justify-center gap-6 p-6">
          {/* AI INTERVIEWER */}
          <div className="w-[320px] h-[220px] bg-[#1a1a2e] rounded-xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
            <style>{`
              @keyframes audio-wave {
                0% { height: 6px; }
                50% { height: 20px; }
                100% { height: 6px; }
              }
              @keyframes mouth-speak {
                0%, 100% { ry: 1.5px; rx: 4px; }
                50% { ry: 4px; rx: 3.5px; }
              }
              @keyframes head-bob {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-3px) rotate(-1deg); }
                75% { transform: translateY(-2px) rotate(1deg); }
              }
              .animate-head-bob { animation: head-bob 1.5s infinite ease-in-out; }
              .animate-audio-wave-1 { animation: audio-wave 0.8s infinite ease-in-out 0.1s; }
              .animate-audio-wave-2 { animation: audio-wave 1.1s infinite ease-in-out 0.3s; }
              .animate-audio-wave-3 { animation: audio-wave 0.9s infinite ease-in-out 0.5s; }
              .animate-audio-wave-4 { animation: audio-wave 1.2s infinite ease-in-out 0.2s; }
              .animate-audio-wave-5 { animation: audio-wave 1.0s infinite ease-in-out 0.4s; }
              .animate-mouth { animation: mouth-speak 0.3s infinite alternate; }
            `}</style>
            
            <div
              className={"absolute inset-0 transition-opacity duration-500 " + (isSpeaking ? "opacity-100" : "opacity-0")}
              style={{ background: "radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
            />
            
            <div className="relative mt-2">
              {/* Outer pulsing ring */}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              )}
              
              <div
                className={"relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 " +
                  (isSpeaking ? "ring-4 ring-purple-400/50 shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-head-bob" : "")
                }
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                  {/* Robot Head Body */}
                  <rect x="12" y="18" width="40" height="32" rx="8" fill="white" fillOpacity="0.9"/>
                  
                  {/* Eyes Base */}
                  <circle cx="26" cy="32" r="4" fill="#1e293b"/>
                  <circle cx="38" cy="32" r="4" fill="#1e293b"/>
                  
                  {/* Eye Highlights */}
                  <circle cx="27.5" cy="30.5" r="1.5" fill={"white"} className={isSpeaking ? "animate-pulse" : ""}/>
                  <circle cx="39.5" cy="30.5" r="1.5" fill={"white"} className={isSpeaking ? "animate-pulse" : ""}/>
                  
                  {/* Mouth */}
                  {isSpeaking ? (
                    <ellipse cx="32" cy="42" rx="4" ry="1.5" fill="#1e293b" className="animate-mouth"/>
                  ) : (
                    <path d="M27 41 Q32 45 37 41" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  )}
                  
                  {/* Antenna */}
                  <line x1="32" y1="18" x2="32" y2="8" stroke="white" strokeOpacity="0.8" strokeWidth="2"/>
                  <circle cx="32" cy="6" r="3" fill="#60a5fa" className={isSpeaking ? "animate-ping opacity-75" : ""}/>
                  {!isSpeaking && <circle cx="32" cy="6" r="3" fill="#60a5fa"/>}
                </svg>
              </div>
              
              {/* Dynamic Waveform */}
              {isSpeaking && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-end justify-center gap-1.5 h-8 w-24">
                  <div className="w-1.5 rounded-full bg-blue-400 animate-audio-wave-1"/>
                  <div className="w-1.5 rounded-full bg-purple-400 animate-audio-wave-2"/>
                  <div className="w-1.5 rounded-full bg-blue-300 animate-audio-wave-3"/>
                  <div className="w-1.5 rounded-full bg-purple-400 animate-audio-wave-4"/>
                  <div className="w-1.5 rounded-full bg-blue-400 animate-audio-wave-5"/>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <p className="text-gray-200 text-sm font-medium">AI Interviewer</p>
              <p className={"text-xs mt-1 " + (isSpeaking ? "text-purple-400 animate-pulse font-medium" : "text-gray-500")}>
                {aiLoading ? "Thinking..." : isSpeaking ? "Speaking..." : "Listening..."}
              </p>
            </div>
          </div>

          {/* YOUR CAMERA */}
          <div className="w-[320px] h-[220px] bg-[#111] rounded-xl border border-white/10 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={"w-full h-full object-cover rounded-xl " + (cameraReady && camOn ? "block" : "hidden")}
              style={{ transform: "scaleX(-1)" }}
            />
            {(!cameraReady || !camOn) && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No Camera Access</p>
              </div>
            )}
            <div className={"absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium " + (micOn ? "bg-green-500/80" : "bg-red-500/80")}>
              {micOn ? "Mic On" : "Mic Off"}
            </div>
            <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded text-xs text-gray-300">You</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRound;
