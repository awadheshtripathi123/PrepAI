const { GoogleGenerativeAI } = require("@google/generative-ai");

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
  const model = getModel();

  const prompt = `Generate exactly ${count} multiple choice questions for a ${difficulty} level ${role} interview.
Return ONLY valid JSON array with this exact format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]
Requirements:
- Each question must have exactly 4 options
- The "answer" field must exactly match one of the options
- Questions should cover DSA, programming concepts, system design, and role-specific topics
- Difficulty: ${difficulty}
- Return ONLY the JSON array, no other text`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).slice(0, count);
    }
    return JSON.parse(response).slice(0, count);
  } catch {
    return null;
  }
};

// Generate coding problem via AI
const generateCodingProblem = async (role, difficulty) => {
  const model = getModel();

  const prompt = `Generate a ${difficulty} level coding problem for a ${role} interview.
Return ONLY valid JSON with this exact format:
{
  "title": "Problem Title",
  "description": "Clear problem description with constraints",
  "input": "Example input",
  "output": "Example output",
  "explanation": "Step by step explanation of the example",
  "defaultCode": {
    "C": "#include <stdio.h>\\n\\nint main() {\\n\\n    return 0;\\n}",
    "C++": "#include <iostream>\\n\\nint main() {\\n\\n    return 0;\\n}",
    "Java": "public class Main {\\n    public static void main(String[] args) {\\n\\n    }\\n}",
    "Python": "def solve():\\n    pass"
  }
}
Return ONLY the JSON, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch {
    return null;
  }
};

// Generate interview questions list via AI
const generateInterviewQuestions = async (role, difficulty, count = 15) => {
  const model = getModel();

  const prompt = `Generate exactly ${count} interview questions for a ${difficulty} level ${role} position.
Return ONLY a valid JSON array of strings. Do not include markdown code blocks. Escape any internal quotes with \\".
Example format:
["Question 1?", "Question 2?", ...]
Include a mix of:
- Tell me about yourself
- Behavioral questions (teamwork, leadership, conflict)
- Technical questions specific to ${role}
- Problem-solving scenarios
- Situational questions
Return ONLY the JSON array, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).slice(0, count);
    }
    return JSON.parse(response).slice(0, count);
  } catch (error) {
    console.error("AI Generation failed for " + role + ". Error or invalid JSON:", error);
    // Generic fallback questions to ensure the UI NEVER breaks completely
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
  const model = getModel();

  const prompt = `You are an expert AI technical interviewer iteratively evaluating a ${role} candidate.
Question: "${question}"
Candidate's answer: "${answer}"
Rate the answer critically on a scale of 0-100 based on technical accuracy, clarity, and completeness.
Provide highly specific, constructive feedback detailing exactly what they did well, what concepts or details were missing, and an actionable tip to improve their response.
Return ONLY valid JSON:
{
  "score": 75,
  "feedback": "Detailed, specific feedback outlining strengths, missing elements, and actionable improvements"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch {
    return { score: 50, feedback: "Unable to evaluate answer." };
  }
};

// Generate custom questions via AI
const generateCustomQuestions = async (topic, difficulty, count = 5, type = "multiple-choice") => {
  const model = getModel();

  let prompt = "";
  if (type === "multiple-choice") {
    prompt = `Generate exactly ${count} multiple choice questions for a ${difficulty} level on the topic of "${topic}".
Return ONLY a valid JSON array with this exact format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]
Requirements:
- Each question must have exactly 4 options
- The "answer" field must exactly match one of the options
- Difficulty: ${difficulty}
- Return ONLY the JSON array, no other text`;
  } else {
    prompt = `Generate exactly ${count} open-ended questions for a ${difficulty} level on the topic of "${topic}".
Return ONLY a valid JSON array of strings like this:
["Question 1?", "Question 2?", ...]
Return ONLY the JSON array, no other text.`;
  }

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).slice(0, count);
    }
    return JSON.parse(response).slice(0, count);
  } catch {
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

  const prompt = `You are an elite career coach and expert technical interviewer providing a final performance review.
Candidate applied for: ${role}
Difficulty Level: ${difficulty}
Test Type (Mode): ${mode}

Scores out of 100:
- Overall Score: ${scores.overallScore}
- Communication: ${scores.communicationScore}
- Confidence: ${scores.confidenceScore}
- Problem Solving: ${scores.problemSolvingScore}
- Technical Knowledge: ${scores.technicalScore}
- Assessment Round: ${scores.assessmentScore}
- Coding Round: ${scores.codingScore}
- Interview Round: ${scores.interviewScore}
${contextSnippet}
Based carefully ONLY on these scores, the selected role, and the interview logs (if provided), generate a deeply insightful and comprehensive evaluation. 
Extract genuinely accurate patterns: what specific concepts/technologies did they struggle to explain? What questions did they answer incorrectly? Where were their strengths?
Return ONLY valid JSON with this exact format. 
NOTE: "recommendations" MUST be an object keyed by mode (e.g., "Assessment", "Coding", "Interview"), where each key contains an array of objects detailing the recommendation for specific questions. If a mode was not tested, omit it or leave empty array.
{
  "feedback": "A highly detailed, personalized, and constructive paragraph explicitly referencing their specific technical strengths for the role, and pinpointing exactly what they need to improve critically to succeed in real-world interviews.",
  "recommendations": {
    "Assessment": [
      { "question": "Specific concept they struggled with", "advice": "Highly actionable study advice, pointing out the foundational gaps (e.g., 'Review React hooks lifecycle...')" }
    ],
    "Coding": [
      { "question": "Problem Title", "advice": "Deep, technical feedback regarding code efficiency (Time/Space complexity), missing edge cases, or alternative data structures" }
    ],
    "Interview": [
      { "question": "Specific question asked", "advice": "Detailed coaching on structuring their answer (e.g., using STAR method), adding required technical depth, or communicating thought process" }
    ]
  },
  "strongTopics": [
    "Topic 1",
    "Topic 2"
  ],
  "weakTopics": [
    "Topic 1",
    "Topic 2"
  ]
}
Return ONLY the JSON, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      return {
        feedback: "JSON Parse error: " + parseError.message + " | Raw AI Output snippet: " + response.substring(0, 150),
        recommendations: { "System": [{ "question": "Parse Error", "advice": "The AI response could not be parsed." }] },
        strongTopics: ["Unknown"],
        weakTopics: ["Unknown"]
      };
    }
  } catch (error) {
    console.error("AI Evaluation Generation Failed:", error);
    return {
      feedback: "API Error: " + error.message,
      recommendations: { "System": [{ "question": "API Error", "advice": "Ensure your API key has enough quota or the prompt is safe." }] },
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
