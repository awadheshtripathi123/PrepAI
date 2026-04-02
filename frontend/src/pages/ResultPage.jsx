import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  if (!location.state && !id) {
    return <div className="text-white p-10">No Data Found</div>;
  }

  const { config, type } = location.state || {};

  useEffect(() => {
    const processResult = async () => {
      // If we are viewing an existing result by ID
      if (id) {
        setLoading(true);
        try {
          const res = await authFetch(`/api/v1/interview/result/${id}`);
          const data = await res.json();
          if (data.success) {
            setResult(data.data);
            setSaved(true);
          } else {
            console.error("Failed to fetch result:", data.error);
          }
        } catch (error) {
          console.error("Failed to fetch result by ID:", error);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Generation logic for new interview
      if (!config) return;

      if (saved) return;
      setLoading(true);
      try {
        const assessmentScorePercentage = config?.assessmentScorePercentage ?? (Math.floor(Math.random() * 40) + 60);
        const assessmentCorrect = config?.assessmentCorrect ?? Math.round((assessmentScorePercentage / 100) * 15);
        const assessmentTotal = config?.assessmentTotal ?? 15;

        const codingScore = config?.codingScore ?? (Math.floor(Math.random() * 40) + 60);
        const interviewScore = config?.interviewScore ?? (Math.floor(Math.random() * 40) + 60);

        let overallScore = 0;
        let count = 0;

        if (config?.mode === 'Assessment' || config?.mode === 'All') {
          overallScore += assessmentScorePercentage;
          count++;
        }
        if (config?.mode === 'Technical Round' || config?.mode === 'All') {
          overallScore += codingScore;
          count++;
        }
        if (config?.mode === 'Interview' || config?.mode === 'All') {
          overallScore += interviewScore;
          count++;
        }
        overallScore = count > 0 ? Math.round(overallScore / count) : 0;

        const communicationScore = Math.floor(Math.random() * 30) + 60;
        const confidenceScore = Math.floor(Math.random() * 30) + 60;
        const problemSolvingScore = Math.floor(Math.random() * 30) + 60;
        const technicalScore = Math.floor(Math.random() * 30) + 60;

        let feedback = '';
        if (overallScore >= 80) {
          feedback = 'Excellent performance! You demonstrated strong knowledge and communication skills. You are well-prepared for real interviews.';
        } else if (overallScore >= 60) {
          feedback = 'Good performance overall. Focus on improving weaker areas like technical depth and structured problem-solving to reach the next level.';
        } else if (overallScore >= 40) {
          feedback = 'Decent effort. Work on building stronger fundamentals in core technical concepts and practice explaining your thought process clearly.';
        } else {
          feedback = 'Keep practicing! Focus on fundamentals like DSA, OOP concepts, and communication skills. Regular mock interviews will help you improve.';
        }

        const res = await authFetch('/api/v1/interview/result', {
          method: 'POST',
          body: JSON.stringify({
            role: config?.role || 'General',
            difficulty: config?.difficulty || 'Intermediate',
            mode: config?.mode || 'All',
            assessmentScore: assessmentCorrect,
            assessmentTotal: assessmentTotal,
            codingScore,
            codingTotal: 100,
            interviewScore,
            interviewEvaluations: config?.interviewEvaluations || [],
            overallScore,
            communicationScore,
            confidenceScore,
            problemSolvingScore,
            technicalScore,
            feedback,
            assessmentDetails: config?.assessmentDetails || [],
            codingDetails: config?.codingDetails || [],
          }),
        });

        const data = await res.json();

        if (data.success) {
          setResult(data.data);
          setSaved(true);
        }
      } catch (error) {
        console.error('Failed to save interview result:', error);
        setSaved(true);
      } finally {
        setLoading(false);
      }
    };

    processResult();
  }, []);

  const handleDownload = () => {
    if (!result) {
      alert('No result data available to download.');
      return;
    }

    const reportDate = new Date(result.completedAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const scoreColor = result.overallScore >= 60 ? '#22c55e' : result.overallScore >= 40 ? '#eab308' : '#ef4444';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PrepAI - Interview Result Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #1e293b; }
    .header h1 { font-size: 28px; color: #60a5fa; margin-bottom: 8px; }
    .header p { color: #94a3b8; font-size: 14px; }
    .score-circle { width: 160px; height: 160px; border-radius: 50%; margin: 30px auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e293b, #0f172a); border: 4px solid ${scoreColor}; }
    .score-num { font-size: 48px; font-weight: bold; color: ${scoreColor}; }
    .score-label { font-size: 14px; color: #94a3b8; }
    .section { background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .section h2 { font-size: 18px; color: #f1f5f9; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 16px; color: #f1f5f9; margin-top: 4px; }
    .skill-row { margin-bottom: 16px; }
    .skill-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .skill-name { font-size: 14px; color: #cbd5e1; }
    .skill-score { font-size: 14px; color: #60a5fa; font-weight: bold; }
    .bar-bg { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #3b82f6, #22c55e); }
    .feedback-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; }
    .feedback-box p { color: #cbd5e1; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e293b; }
    .footer p { color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PrepAI - Interview Result Report</h1>
      <p>Generated on: ${reportDate}</p>
    </div>
    <div class="score-circle">
      <div class="score-num">${result.overallScore}</div>
      <div class="score-label">Overall Score</div>
    </div>
    <div class="section">
      <h2>Interview Details</h2>
      <div class="info-grid">
        <div><div class="info-label">Role</div><div class="info-value">${result.role}</div></div>
        <div><div class="info-label">Difficulty</div><div class="info-value">${result.difficulty}</div></div>
        <div><div class="info-label">Mode</div><div class="info-value">${result.mode}</div></div>
        <div><div class="info-label">Level</div><div class="info-value">${result.level}</div></div>
      </div>
    </div>
    <div class="section">
      <h2>Round Scores</h2>
      <div class="info-grid">
        ${result.mode === 'Assessment' || result.mode === 'All' ? '<div><div class="info-label">Assessment</div><div class="info-value">' + (result.assessmentScore ?? 0) + ' / ' + (result.assessmentTotal || 15) + '</div></div>' : ''}
        ${result.mode === 'Technical Round' || result.mode === 'All' ? '<div><div class="info-label">Coding</div><div class="info-value">' + (result.codingScore ?? 0) + ' / 100</div></div>' : ''}
        ${result.mode === 'Interview' || result.mode === 'All' ? '<div><div class="info-label">Interview</div><div class="info-value">' + (result.interviewScore ?? 0) + ' / 100</div></div>' : ''}
      </div>
    </div>
    <div class="section">
      <h2>Skill Analysis</h2>
      <div class="skill-row">
        <div class="skill-header"><span class="skill-name">Communication</span><span class="skill-score">${result.communicationScore}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${result.communicationScore}%"></div></div>
      </div>
      <div class="skill-row">
        <div class="skill-header"><span class="skill-name">Confidence</span><span class="skill-score">${result.confidenceScore}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${result.confidenceScore}%"></div></div>
      </div>
      <div class="skill-row">
        <div class="skill-header"><span class="skill-name">Problem Solving</span><span class="skill-score">${result.problemSolvingScore}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${result.problemSolvingScore}%"></div></div>
      </div>
      <div class="skill-row">
        <div class="skill-header"><span class="skill-name">Technical Knowledge</span><span class="skill-score">${result.technicalScore}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${result.technicalScore}%"></div></div>
      </div>
    </div>
    <div class="section">
      <h2>AI Feedback</h2>
      <div class="feedback-box"><p>${result.feedback}</p></div>
    </div>

    ${result.recommendations && typeof result.recommendations === 'object' && !Array.isArray(result.recommendations) && Object.keys(result.recommendations).length > 0 ? `
    <div class="section">
      <h2>Mode-Specific AI Recommendations</h2>
      ${Object.keys(result.recommendations).map(recMode => `
        <div style="margin-bottom: 16px;">
          <h3 style="color: #60a5fa; margin-bottom: 8px; font-size: 16px;">${recMode} Round</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${Array.isArray(result.recommendations[recMode]) ? result.recommendations[recMode].map(rec => `
              <li style="background: #0f172a; padding: 12px; border: 1px solid #334155; border-radius: 6px; margin-bottom: 8px;">
                <span style="font-weight: bold; display: block; margin-bottom: 4px;">Q: ${rec.question}</span>
                <span style="color: #94a3b8;">Hint: ${rec.advice}</span>
              </li>
            `).join('') : ''}
          </ul>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${(result.strongTopics && result.strongTopics.length > 0) || (result.weakTopics && result.weakTopics.length > 0) ? `
    <div class="section">
      <h2>Topic Analysis</h2>
      <div class="info-grid">
        ${result.strongTopics && result.strongTopics.length > 0 ? `
        <div>
          <h3 style="color: #22c55e; font-size: 16px; margin-bottom: 8px;">Strong Topics</h3>
          <ul style="color: #cbd5e1; font-size: 14px; padding-left: 20px;">
            ${result.strongTopics.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join('')}
          </ul>
        </div>
        ` : '<div></div>'}
        ${result.weakTopics && result.weakTopics.length > 0 ? `
        <div>
          <h3 style="color: #ef4444; font-size: 16px; margin-bottom: 8px;">Topics to Improve</h3>
          <ul style="color: #cbd5e1; font-size: 14px; padding-left: 20px;">
            ${result.weakTopics.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join('')}
          </ul>
        </div>
        ` : '<div></div>'}
      </div>
    </div>
    ` : ''}

    ${result.assessmentDetails && result.assessmentDetails.length > 0 ? `
    <div class="section">
      <h2>Assessment Round Logs</h2>
      ${result.assessmentDetails.map((a, i) => `
        <div style="background: #0f172a; padding: 12px; border: 1px solid #334155; border-radius: 6px; margin-bottom: 8px;">
          <p style="font-weight: bold; margin-bottom: 4px;">Q${i+1}: ${a.question}</p>
          <p style="color: #94a3b8;">Your Answer: <span style="color: ${a.isCorrect ? '#22c55e' : '#ef4444'}">${a.userAnswer || "Not Attempted"}</span></p>
          ${!a.isCorrect ? `<p style="color: #22c55e; margin-top: 4px;">Correct Answer: ${a.expectedAnswer}</p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${result.codingDetails && result.codingDetails.length > 0 ? `
    <div class="section">
      <h2>Coding Round Logs</h2>
      ${result.codingDetails.map((c, i) => `
        <div style="background: #0f172a; padding: 12px; border: 1px solid #334155; border-radius: 6px; margin-bottom: 8px;">
          <p style="font-weight: bold; margin-bottom: 4px;">Problem: ${c.problemTitle}</p>
          <p style="color: #60a5fa; margin-bottom: 8px;">Language: ${c.language}</p>
          <pre style="background: #000; padding: 12px; border-radius: 4px; overflow-x: auto; color: #cbd5e1; font-size: 12px; margin-bottom: 8px; white-space: pre-wrap;">${c.codeSubmitted}</pre>
          <p style="color: #94a3b8;">Execution Output: <span style="color: #f1f5f9;">${c.feedback}</span></p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${result.interviewDetails && result.interviewDetails.length > 0 ? `
    <div class="section">
      <h2>Interview Round Logs</h2>
      ${result.interviewDetails.map((v, i) => `
        <div style="background: #0f172a; padding: 12px; border: 1px solid #334155; border-radius: 6px; margin-bottom: 8px;">
          <p style="font-weight: bold; color: #60a5fa; margin-bottom: 4px;">Q${i+1}: ${v.question}</p>
          <p style="font-style: italic; margin-bottom: 8px;">"${v.answer}"</p>
          <p style="font-weight: bold; color: ${v.score >= 80 ? '#22c55e' : v.score >= 50 ? '#eab308' : '#ef4444'}; border-top: 1px solid #334155; padding-top: 8px; margin-top: 8px;">AI Score: ${v.score}/100</p>
          <p style="color: #94a3b8; margin-top: 4px;">Feedback: ${v.feedback}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="footer">
      <p>Report generated by PrepAI - AI-Powered Interview Preparation Platform</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PrepAI_Report_' + (result.role || 'Result').replace(/\s+/g, '_') + '_' + new Date().toISOString().split('T')[0] + '.html';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleRetake = () => {
    if (type === "role") {
      navigate("/mock/role", { state: { type: "role" } });
    } else if (type === "resume") {
      navigate("/mock/resume", { state: { type: "resume" } });
    } else if (type === "report") {
      navigate("/mock/report", { state: { type: "report" } });
    } else if (type === "company") {
      navigate("/mock/company", { state: { type: "company" } });
    } else {
      navigate("/mock");
    }
  };

  const getLabel = () => {
    if (type === "role") return "Retake Role-Based Interview";
    if (type === "resume") return "Retake Resume-Based Interview";
    if (type === "report") return "Retake Report-Based Interview";
    if (type === "company") return "Retake Company Mock";
    return "Retake Interview";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 80) return 'border-green-400';
    if (score >= 60) return 'border-yellow-400';
    if (score >= 40) return 'border-orange-400';
    return 'border-red-400';
  };

  const getLevelBadge = (level) => {
    if (level === 'Advance') return 'bg-green-500';
    if (level === 'Intermediate') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0b1220] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Generating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pt-2 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#1e293b] border border-white/10 rounded px-4 py-2 shadow-sm mb-5">
        <h2 className="font-semibold">Interview Result</h2>

        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded shadow transition flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Report
        </button>
      </div>

      <div className="flex-1 space-y-5 pb-24">

        {/* OVERALL SCORE */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-8 flex flex-col items-center">
          <p className="text-gray-400 text-sm mb-4">Overall Score</p>

          <div className={'w-40 h-40 rounded-full border-4 ' + getScoreBorderColor(result?.overallScore || 0) + ' flex flex-col items-center justify-center mb-4'}>
            <span className={'text-5xl font-bold ' + getScoreColor(result?.overallScore || 0)}>
              {(result?.mode === 'Assessment' && result?.assessmentTotal) ? result.assessmentScore : (result?.overallScore || 0)}
            </span>
            <span className="text-gray-400 text-sm">/ {(result?.mode === 'Assessment' && result?.assessmentTotal) ? result.assessmentTotal : 100}</span>
          </div>

          {result?.level && (
            <span className={getLevelBadge(result.level) + ' text-white text-sm px-4 py-1 rounded-full font-medium'}>
              {result.level}
            </span>
          )}

          <p className="text-gray-400 text-sm mt-3">
            {result?.completedAt ? new Date(result.completedAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : ''}
          </p>
        </div>

        {/* INTERVIEW DETAILS */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Interview Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase">Role</p>
              <p className="text-white text-sm mt-1">{result?.role || 'General'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Difficulty</p>
              <p className="text-white text-sm mt-1">{result?.difficulty || 'Intermediate'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Mode</p>
              <p className="text-white text-sm mt-1">{result?.mode || 'All'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Status</p>
              <p className="text-green-400 text-sm mt-1">Completed</p>
            </div>
          </div>
        </div>

        {/* ROUND SCORES */}
        <div className={`grid gap-4 ${result?.mode === 'All' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 max-w-md mx-auto w-full'}`}>
          {(result?.mode === 'Assessment' || result?.mode === 'All') && (
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-xs uppercase mb-2">Assessment Round</p>
              <p className={'text-3xl font-bold ' + getScoreColor(result?.overallScore || 0)}>
                {result?.assessmentScore ?? 0}
              </p>
              <p className="text-gray-500 text-sm">/ {result?.assessmentTotal || 15}</p>
              <div className="mt-3 h-2 bg-gray-700 rounded">
                <div
                  className="h-2 bg-blue-500 rounded transition-all"
                  style={{ width: result?.assessmentTotal ? ((result.assessmentScore / result.assessmentTotal) * 100 + '%') : '0%' }}
                />
              </div>
            </div>
          )}

          {(result?.mode === 'Technical Round' || result?.mode === 'All') && (
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-xs uppercase mb-2">Coding Round</p>
              <p className={'text-3xl font-bold ' + getScoreColor(result?.codingScore || 0)}>
                {result?.codingScore ?? 0}
              </p>
              <p className="text-gray-500 text-sm">/ 100</p>
              <div className="mt-3 h-2 bg-gray-700 rounded">
                <div
                  className="h-2 bg-orange-500 rounded transition-all"
                  style={{ width: (result?.codingScore || 0) + '%' }}
                />
              </div>
            </div>
          )}

          {(result?.mode === 'Interview' || result?.mode === 'All') && (
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-xs uppercase mb-2">Interview Round</p>
              <p className={'text-3xl font-bold ' + getScoreColor(result?.interviewScore || 0)}>
                {result?.interviewScore ?? 0}
              </p>
              <p className="text-gray-500 text-sm">/ 100</p>
              <div className="mt-3 h-2 bg-gray-700 rounded">
                <div
                  className="h-2 bg-green-500 rounded transition-all"
                  style={{ width: (result?.interviewScore || 0) + '%' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* SKILL BREAKDOWN */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-5">Skill Analysis</h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm">Communication Skills</span>
                <span className={'text-sm font-semibold ' + getScoreColor(result?.communicationScore || 0)}>
                  {result?.communicationScore || 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: (result?.communicationScore || 0) + '%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm">Confidence & Body Language</span>
                <span className={'text-sm font-semibold ' + getScoreColor(result?.confidenceScore || 0)}>
                  {result?.confidenceScore || 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-700"
                  style={{ width: (result?.confidenceScore || 0) + '%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm">Problem-Solving Approach</span>
                <span className={'text-sm font-semibold ' + getScoreColor(result?.problemSolvingScore || 0)}>
                  {result?.problemSolvingScore || 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: (result?.problemSolvingScore || 0) + '%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm">Technical Knowledge</span>
                <span className={'text-sm font-semibold ' + getScoreColor(result?.technicalScore || 0)}>
                  {result?.technicalScore || 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full">
                <div
                  className="h-3 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: (result?.technicalScore || 0) + '%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI FEEDBACK */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">AI Feedback</h3>
          <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {result?.feedback || 'No feedback available.'}
            </p>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Mode-Specific AI Recommendations</h3>
          <div className="space-y-6 text-sm text-gray-300">
            {result?.recommendations && typeof result.recommendations === 'object' && !Array.isArray(result.recommendations) && Object.keys(result.recommendations).length > 0 ? (
              Object.keys(result.recommendations).map((recMode) => (
                <div key={recMode}>
                  <h4 className="text-blue-400 font-semibold mb-3 bg-blue-500/10 px-3 py-1 rounded inline-block">{recMode} Round</h4>
                  <ul className="space-y-3">
                    {Array.isArray(result.recommendations[recMode]) ? result.recommendations[recMode].map((rec, index) => (
                      <li key={index} className="flex flex-col gap-1 bg-[#0f172a] p-4 rounded-lg border border-gray-700">
                        <span className="font-semibold text-white">Q: {rec.question}</span>
                        <span className="text-gray-400 mt-1">Hint: {rec.advice}</span>
                      </li>
                    )) : null}
                  </ul>
                </div>
              ))
            ) : Array.isArray(result?.recommendations) && result.recommendations.length > 0 ? (
              result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">&#8226;</span>
                  {rec}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No AI recommendations available yet.</div>
            )}
          </div>
        </div>

        {/* TOPIC ANALYSIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
            <h3 className="text-green-400 font-semibold mb-3">Strong Topics</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {result?.strongTopics && result.strongTopics.length > 0 ? (
                 result.strongTopics.map((topic, index) => (
                   <li key={index} className="flex items-start gap-2">
                     <span className="text-green-400 mt-0.5">✓</span>
                     {topic}
                   </li>
                 ))
              ) : (
                <li className="text-gray-500">Not enough data to determine strong topics.</li>
              )}
            </ul>
          </div>
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-3">Topics to Improve</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {result?.weakTopics && result.weakTopics.length > 0 ? (
                 result.weakTopics.map((topic, index) => (
                   <li key={index} className="flex items-start gap-2">
                     <span className="text-red-400 mt-0.5">!</span>
                     {topic}
                   </li>
                 ))
              ) : (
                <li className="text-gray-500">Not enough data to determine areas for improvement.</li>
              )}
            </ul>
          </div>
        </div>

      </div>
      
      {/* DETAILED QUESTION LOGS */}
      <div className="space-y-6 mb-6">
        {result?.assessmentDetails && result.assessmentDetails.length > 0 && (
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 text-lg border-b border-white/10 pb-2">Assessment Round Logs</h3>
            <div className="space-y-4">
              {result.assessmentDetails.map((a, i) => (
                <div key={i} className="bg-[#0f172a] border border-gray-700 p-4 rounded-lg text-sm">
                  <p className="font-semibold text-white mb-2">Q{i + 1}: {a.question}</p>
                  <p className="text-gray-400">Your Answer: <span className={a.isCorrect ? "text-green-400" : "text-red-400"}>{a.userAnswer || "Not Attempted"}</span></p>
                  {!a.isCorrect && <p className="text-green-400 mt-1">Correct Answer: {a.expectedAnswer}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.codingDetails && result.codingDetails.length > 0 && (
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 text-lg border-b border-white/10 pb-2">Coding Round Logs</h3>
            <div className="space-y-4">
              {result.codingDetails.map((c, i) => (
                <div key={i} className="bg-[#0f172a] border border-gray-700 p-4 rounded-lg text-sm">
                  <p className="font-semibold text-white mb-1">Problem: {c.problemTitle}</p>
                  <p className="text-blue-400 mb-2">Language: {c.language}</p>
                  <div className="bg-black/50 p-3 rounded font-mono text-gray-300 text-xs mb-2 overflow-x-auto whitespace-pre-wrap">
                    {c.codeSubmitted}
                  </div>
                  <p className="text-gray-400">Execution Output: <span className="text-white">{c.feedback}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.interviewDetails && result.interviewDetails.length > 0 && (
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 text-lg border-b border-white/10 pb-2">Interview Round Logs</h3>
            <div className="space-y-4">
              {result.interviewDetails.map((v, i) => (
                <div key={i} className="bg-[#0f172a] border border-gray-700 p-4 rounded-lg text-sm">
                  <p className="font-semibold text-blue-400 mb-2">Q{i + 1}: {v.question}</p>
                  <p className="text-white italic mb-2">" {v.answer} "</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                    <span className={"font-bold " + (v.score >= 80 ? 'text-green-400' : v.score >= 50 ? 'text-yellow-400' : 'text-red-400')}>AI Score: {v.score}/100</span>
                  </div>
                  <p className="text-gray-400 mt-1">Feedback: {v.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex justify-between items-center mt-4 pb-2">
        <button
          onClick={() => navigate('/analytics')}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm transition"
        >
          View Analytics
        </button>

        <button
          onClick={handleRetake}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          {getLabel()}
        </button>
      </div>

    </div>
  );
};

export default ResultPage;
