import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authFetch } from "../utils/api";

const AssessmentRound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const role = location.state?.config?.role || "Software Developer";
        const difficulty = location.state?.config?.difficulty || "Intermediate";
        const res = await authFetch(
          `/api/v1/assessment/questions?role=${encodeURIComponent(role)}&difficulty=${encodeURIComponent(difficulty)}`
        );
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (!location.state) {
    return <div className="text-white p-10">No Data Found</div>;
  }

  const { flow, step, config } = location.state;
  const totalQuestions = questions.length;
  const question = questions[currentQ - 1];

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: option }));
  };

  const handleSubmit = async () => {
    let score = 0;
    const assessmentDetails = questions.map((q, i) => {
      const isCorrect = q.answer === answers[i + 1];
      if (isCorrect) score++;
      return {
        question: q.text,
        options: q.options,
        expectedAnswer: q.answer,
        userAnswer: answers[i + 1] || null,
        isCorrect
      };
    });

    let updatedConfig = { ...config, assessmentDetails };

    try {
      const res = await authFetch("/api/v1/assessment/submit", {
        method: "POST",
        body: JSON.stringify({
          answers,
          questions,
          role: config?.role || "",
          difficulty: config?.difficulty || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        updatedConfig.assessmentScorePercentage = data.data.score;
        updatedConfig.assessmentCorrect = data.data.correctAnswers;
        updatedConfig.assessmentTotal = data.data.totalQuestions;
      }
    } catch (error) {
      console.error("Failed to save assessment result:", error);
      // Fallback if API fails
      updatedConfig.assessmentCorrect = score;
      updatedConfig.assessmentTotal = questions.length;
      updatedConfig.assessmentScorePercentage = Math.round((score / questions.length) * 100);
    }

    handleNext(updatedConfig);
  };

  const handleNext = (updatedConfig = config) => {
    const nextStep = step + 1;
    if (nextStep >= flow.length) return;
    const nextPage = flow[nextStep];
    navigate("/mock/" + nextPage, {
      state: { flow, step: nextStep, config: updatedConfig },
    });
  };

  const goNext = () => {
    if (currentQ < totalQuestions) setCurrentQ(currentQ + 1);
    else handleSubmit();
  };

  const goPrev = () => {
    if (currentQ > 1) setCurrentQ(currentQ - 1);
  };

  if (loading || questions.length === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Generating questions with AI...</p>
          <p className="text-gray-500 text-xs mt-1">Role: {config?.role || "Software Developer"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4">
      <div className="flex justify-between items-center mb-4 bg-[#2a2a2a] p-3 rounded-lg">
        <h2 className="text-lg font-semibold">Assessment Round</h2>
        <button onClick={handleSubmit} className="bg-blue-500 px-4 py-1 rounded-lg">
          Submit
        </button>
      </div>

      <div className="flex gap-4 h-[85%]">
        <div className="w-[250px] min-h-[calc(100vh-220px)] bg-[#2a2a2a] p-4 rounded-lg">
          <h3 className="mb-3 font-semibold">Question Navigator</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(totalQuestions)].map((_, i) => {
              const qNum = i + 1;
              const isAnswered = answers[qNum];
              return (
                <div
                  key={qNum}
                  onClick={() => setCurrentQ(qNum)}
                  className={"text-center py-2 rounded cursor-pointer " +
                    (qNum === currentQ ? "bg-blue-500 " : "") +
                    (isAnswered ? "bg-green-500" : "bg-gray-600")
                  }
                >
                  {qNum}
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Attempted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Not Attempted</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#2a2a2a] p-6 rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg mb-4">Question {currentQ}</h3>
            <p className="mb-6">{question.text}</p>
            <div className="space-y-3">
              {question.options.map((opt, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={"q-" + currentQ}
                    checked={answers[currentQ] === opt}
                    onChange={() => handleSelect(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={goPrev} className="bg-gray-600 px-4 py-2 rounded flex items-center gap-2">
              <ArrowLeft size={16} /> Previous
            </button>
            <button onClick={goNext} className="bg-blue-500 px-4 py-2 rounded flex items-center gap-2">
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRound;
