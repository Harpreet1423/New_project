import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sanitizes a raw JSON string by escaping any unescaped control characters
 * (newlines, carriage returns, tabs) that appear inside JSON string values.
 * Gemini often emits literal newlines inside strings, making JSON.parse fail.
 */
function sanitizeJSON(raw) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escaped) {
      escaped = false;
      result += ch;
      continue;
    }

    if (ch === "\\" && inString) {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      // Escape control characters that are illegal inside JSON strings
      if (ch === "\n") { result += "\\n"; continue; }
      if (ch === "\r") { result += "\\r"; continue; }
      if (ch === "\t") { result += "\\t"; continue; }
    }

    result += ch;
  }

  return result;
}

/**
 * Tries multiple strategies to parse the JSON from Gemini's raw response text.
 * Returns a parsed object or null if all strategies fail.
 */
function parseGeminiResponse(text) {
  // Strategy 1: direct parse
  try { return JSON.parse(text.trim()); } catch (_) {}

  // Strategy 2: strip markdown code fences then parse
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(stripped); } catch (_) {}

  // Strategy 3: extract first {...} block then parse
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (_) {}

  // Strategy 4: sanitize unescaped control chars then parse
  try { return JSON.parse(sanitizeJSON(match[0])); } catch (_) {}

  return null;
}

/**
 * Calls Gemini to refine a resume professionally.
 * @param {string} resumeText
 * @returns {{ improvedResume: string, suggestions: string[] }}
 */
export async function refineResume(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a professional resume writer and ATS optimization expert.

Improve the following resume professionally:
- Enhance grammar and clarity
- Rewrite bullet points with strong action verbs
- Make it ATS-friendly with relevant industry keywords
- Do NOT add fake experience or fabricate any information
- Keep all content truthful and accurate

Resume:
${resumeText}

IMPORTANT: Respond ONLY with a raw JSON object — no markdown, no code fences, no extra text.
Use \\n for newlines inside string values. Use this exact format:
{"improvedResume":"full improved resume text here","suggestions":["suggestion 1","suggestion 2","suggestion 3","suggestion 4","suggestion 5"]}`;

  let rawText = "";

  try {
    const result = await model.generateContent(prompt);

    // Gracefully handle safety-blocked or empty responses
    if (!result?.response) throw new Error("No response from Gemini");
    rawText = result.response.text();
    if (!rawText?.trim()) throw new Error("Empty response from Gemini");
  } catch (err) {
    throw new Error(`Gemini API call failed: ${err.message}`);
  }

  const parsed = parseGeminiResponse(rawText);

  if (!parsed || typeof parsed.improvedResume !== "string") {
    throw new Error("Could not parse a valid resume from the AI response");
  }

  return {
    improvedResume: parsed.improvedResume,
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
  };
}
