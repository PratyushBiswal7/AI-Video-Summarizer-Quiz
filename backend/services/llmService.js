const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY in env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function summarizeText(text) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `
You are an assistant summarizing educational transcripts.
Summarize clearly in 8-12 bullet points within 160 words, in English.
Focus on definitions, steps, examples, and key takeaways.
Transcript:
"""${text}"""
Summary:
`;
  const res = await model.generateContent(prompt);
  return res.response.text();
}

async function generateQuizFromSummary(summary) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `
From the summary, create exactly 5 multiple-choice questions.
Return STRICT JSON array with this schema:
[
  {"question":"string","options":["A","B","C","D"],"correctIndex":0,"explanation":"string"}
]
Ensure one correct answer per question and no ambiguity.
Summary:
"""${summary}"""
JSON:
`;
  const res = await model.generateContent(prompt);
  return res.response.text();
}

module.exports = { summarizeText, generateQuizFromSummary };
