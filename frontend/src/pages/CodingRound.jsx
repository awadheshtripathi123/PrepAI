import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { authFetch } from "../utils/api";

const CodingRound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("C");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const role = location.state?.config?.role || "Software Developer";
        const difficulty = location.state?.config?.difficulty || "Intermediate";
        const res = await authFetch(
          `/api/v1/coding/problem?role=${encodeURIComponent(role)}&difficulty=${encodeURIComponent(difficulty)}`
        );
        const data = await res.json();
        if (data.success) {
          setProblem(data.data);
          setCode(data.data.defaultCode["C"]);
        }
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, []);

  useEffect(() => {
    if (problem) {
      if (language === "C++") setCode(problem.defaultCode["C++"]);
      else if (language === "Python") setCode(problem.defaultCode["Python"]);
      else if (language === "Java") setCode(problem.defaultCode["Java"]);
      else setCode(problem.defaultCode["C"]);
    }
  }, [language, problem]);

  if (!location.state) {
    return <div className="text-white p-10">No Data Found</div>;
  }

  const { flow, step, config } = location.state;

  const handleRun = async () => {
    setOutput("Running...");
    try {
      const res = await authFetch("/api/v1/coding/run", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setOutput(data.success ? data.data.output : "Error: " + data.error);
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };

  const handleSubmit = async () => {
    setOutput("Submitting...");
    try {
      const res = await authFetch("/api/v1/coding/submit", {
        method: "POST",
        body: JSON.stringify({ code, language, role: config?.role, difficulty: config?.difficulty }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.data.message);
        const updatedConfig = { 
          ...config,
          codingScore: data.data.score,
          codingDetails: [{
            problemTitle: problem.title,
            description: problem.description,
            input: problem.input,
            output: problem.output,
            language: language,
            codeSubmitted: code,
            evaluationScore: data.data.score || 100,
            feedback: "All test cases passed."
          }]
        };
        setTimeout(() => handleNext(updatedConfig), 2000);
      } else {
        setOutput("Error: " + data.error);
      }
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };

  const handleNext = (updatedConfig = config) => {
    const nextStep = step + 1;
    if (nextStep >= flow.length) return;
    navigate("/mock/" + flow[nextStep], {
      state: { flow, step: nextStep, config: updatedConfig },
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Generating coding problem with AI...</p>
          <p className="text-gray-500 text-xs mt-1">Role: {config?.role || "Software Developer"}</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return <div className="text-white p-10">Failed to load problem</div>;
  }

  return (
    <div className="w-full min-h-[calc(100vh-220px)] bg-[#1c1c1c] text-white p-4">
      <div className="flex justify-between items-center mb-3 bg-[#2a2a2a] p-3 rounded-lg">
        <div className="flex gap-4 text-sm">
          <span className="border-b-2 border-blue-500 pb-1 cursor-pointer">Problem</span>
          <span className="opacity-60 cursor-pointer">Submissions</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1c1c1c] border border-gray-600 px-2 py-1 rounded"
          >
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>
          <button onClick={handleRun} className="bg-gray-600 px-4 py-1 rounded">Run Code</button>
          <button onClick={handleSubmit} className="bg-blue-500 px-4 py-1 rounded">Submit Code</button>
        </div>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 280px)" }}>
        <div className="w-[35%] bg-[#2a2a2a] p-4 rounded-lg overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">{problem.title}</h2>
          <p className="text-sm mb-4 text-gray-300">{problem.description}</p>
          <div className="mb-3">
            <h4 className="font-semibold mb-1">Input</h4>
            <div className="bg-[#1c1c1c] p-2 rounded text-sm">{problem.input}</div>
          </div>
          <div className="mb-3">
            <h4 className="font-semibold mb-1">Output</h4>
            <div className="bg-[#1c1c1c] p-2 rounded text-sm">{problem.output}</div>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Explanation</h4>
            <div className="bg-[#1c1c1c] p-2 rounded text-sm whitespace-pre-line">{problem.explanation}</div>
          </div>
        </div>

        <div className="flex-1 bg-[#2a2a2a] rounded-lg flex flex-col">
          <Editor
            height="70%"
            language={language.toLowerCase() === "c++" ? "cpp" : language.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
          />
          <div className="h-[30%] bg-[#0d1117] p-4 text-white font-mono text-sm overflow-y-auto">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingRound;
