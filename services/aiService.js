import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Calls Gemini to refine a resume professionally.
 * @param {string} resumeText - The raw resume text to improve.
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

Respond ONLY with a valid JSON object (no markdown, no code fences) in this exact format:
{
  "improvedResume": "the complete improved resume text here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract the JSON object from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");

  return JSON.parse(jsonMatch[0]);
}
