const { GoogleGenerativeAI } = require("@google/generative-ai");

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

const getJsonModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });
};

// Generate AI chat response
const generateChatResponse = async (userMessage, userName, userContext) => {
  const model = getModel();

  const prompt = `You are PrepAI, an AI interview preparation assistant for ${userName || "the user"}.
You help with mock interviews, coding practice, and career guidance.
${userContext ? "User context: " + userContext : ""}
Be concise, helpful, and encouraging. Keep responses under 150 words.

User message: ${userMessage}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate assessment questions via AI
const generateAssessmentQuestions = async (role, difficulty, count = 15) => {
  const model = getJsonModel();

  const prompt = `Generate exactly ${count} multiple choice questions for a ${difficulty} level ${role} interview.
Format: Array of objects with "text", "options" (array of 4 strings), and "answer" (must exactly match one option). Be extremely concise. Keep questions under 12 words to prioritize speed.
Topics: DSA, programming concepts, system design, and role-specific.`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return Array.isArray(parsed) ? parsed.slice(0, count) : parsed.questions.slice(0, count);
  } catch (e) {
    console.error("AI Parse error Assessment:", e);
    return null;
  }
};

// Generate coding problem via AI
const generateCodingProblem = async (role, difficulty) => {
  const model = getJsonModel();

  const prompt = `Generate a ${difficulty} level coding problem for a ${role} interview.
Format: Object with "title", "description" (with constraints), "input", "output", "explanation", "defaultCode" (object with keys C, C++, Java, Python).
CRITICAL RULE: The "defaultCode" must ONLY contain completely empty boilerplate templates (e.g. just the class/main function signature). It MUST NOT contain any implementation, logic, or solution code whatsoever.`;

  const result = await model.generateContent(prompt);
  try {
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("AI Parse error Coding:", e);
    return null;
  }
};

// Generate interview questions list via AI
const generateInterviewQuestions = async (role, difficulty, count = 15) => {
  const model = getJsonModel();

  const prompt = `Generate exactly ${count} interview questions for a ${difficulty} level ${role} position.
Format: Array of strings. Be extremely concise, max 10 words per question to prioritize speed.
Mix includes: Tell me about yourself, Behavioral, Technical, Problem-solving.`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return Array.isArray(parsed) ? parsed.slice(0, count) : parsed.questions.slice(0, count);
  } catch (error) {
    console.error("AI Generation failed for " + role + ". Error or invalid JSON:", error);
    return [
      "Tell me about yourself.",
      "What are your greatest strengths?",
      "What is your greatest weakness?",
      "Why do you want this " + role + " role?",
      "Where do you see yourself in 5 years?",
      "Describe a time you solved a difficult technical problem.",
      "How do you handle conflict in a team?"
    ];
  }
};

// Generate next interview question based on previous answer via AI (live follow-up)
const generateNextQuestion = async (role, previousQuestion, previousAnswer) => {
  const model = getModel();

  const prompt = `You are an AI interviewer for a ${role} position.
The candidate was asked: "${previousQuestion}"
They answered: "${previousAnswer}"
Based on their answer, generate the next relevant interview question.
Return ONLY the question text, nothing else. Keep it under 2 sentences.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Evaluate interview answer via AI
const evaluateAnswer = async (role, question, answer) => {
  const model = getJsonModel();

  const prompt = `Expert AI evaluating a ${role} candidate.
Question: "${question}"
Answer: "${answer}"
Rate answer critically (0-100) based on accuracy, clarity, completeness.
Format: Object with "score" (number) and "feedback" (string detailing strengths, missing elements, actionable tip).`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("AI Parse error Evaluate:", e);
    return { score: 50, feedback: "Unable to evaluate answer due to processing error." };
  }
};

// Generate custom questions via AI
const generateCustomQuestions = async (topic, difficulty, count = 5, type = "multiple-choice") => {
  const model = getJsonModel();

  let prompt = "";
  if (type === "multiple-choice") {
    prompt = `Generate exactly ${count} multiple choice questions for a ${difficulty} level on "${topic}".
Format: Array of objects with "text", "options" (array of 4 strings), and "answer".`;
  } else {
    prompt = `Generate exactly ${count} open-ended questions for a ${difficulty} level on "${topic}".
Format: Array of strings.`;
  }

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return Array.isArray(parsed) ? parsed.slice(0, count) : (parsed.questions || parsed).slice(0, count);
  } catch (e) {
    console.error("AI Parse error CustomQuestions:", e);
    return null;
  }
};

// Generate comprehensive performance evaluation via AI
const generatePerformanceEvaluation = async (role, mode, difficulty, scores, assessmentDetails = [], codingDetails = [], interviewEvaluations = []) => {
  const model = getModel();

  let contextSnippet = "\\n--- CANDIDATE PERFORMANCE LOGS ---\\n";
  if (assessmentDetails && assessmentDetails.length > 0) {
    contextSnippet += "\\n[ASSESSMENT ROUND]\\n";
    assessmentDetails.forEach((a, i) => {
      contextSnippet += `Q${i + 1}: ${a.question}\\nCandidate Answer: ${a.userAnswer}\\nCorrect Answer: ${a.expectedAnswer}\\nScore: ${a.isCorrect ? 'Correct' : 'Incorrect'}\\n\\n`;
    });
  }
  if (codingDetails && codingDetails.length > 0) {
    contextSnippet += "\\n[CODING ROUND]\\n";
    codingDetails.forEach((c) => {
      contextSnippet += `Problem: ${c.problemTitle}\\nLanguage: ${c.language}\\nCode Submitted:\\n${c.codeSubmitted}\\nExecution Output: ${c.feedback}\\n\\n`;
    });
  }
  if (interviewEvaluations && interviewEvaluations.length > 0) {
    contextSnippet += "\\n[INTERVIEW ROUND]\\n";
    interviewEvaluations.forEach((evalItem, i) => {
      contextSnippet += `Q${i + 1}: ${evalItem.question}\\nCandidate Answer: ${evalItem.answer}\\nAI Score: ${evalItem.score}\\nAI Feedback: ${evalItem.feedback}\\n\\n`;
    });
  }

  const prompt = `Elite career coach providing final performance review.
Role: ${role} | Difficulty: ${difficulty} | Mode: ${mode}
Scores: Overall: ${scores.overallScore}, Comm: ${scores.communicationScore}, Conf: ${scores.confidenceScore}, Prob Solving: ${scores.problemSolvingScore}, Tech: ${scores.technicalScore}, Assess: ${scores.assessmentScore}, Code: ${scores.codingScore}, Interview: ${scores.interviewScore}
${contextSnippet}
Format: Object with "feedback" (string, concise but impactful), "recommendations" (object keyed by mode "Assessment"/"Coding"/"Interview" containing array of {question, advice}), "strongTopics" (array of strings), "weakTopics" (array of strings).`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Evaluation Generation Failed:", error);
    return {
      feedback: "API Error: " + error.message,
      recommendations: { "System": [{ "question": "API Error", "advice": "Please try again later." }] },
      strongTopics: ["Unknown"],
      weakTopics: ["Unknown"]
    };
  }
};

module.exports = {
  generateChatResponse,
  generateAssessmentQuestions,
  generateCodingProblem,
  generateInterviewQuestions,
  generateNextQuestion,
  evaluateAnswer,
  generateCustomQuestions,
  generatePerformanceEvaluation,
};
