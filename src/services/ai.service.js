const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// ✅ Zod Schema
const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});


// ✅ MAIN FUNCTION
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are an expert interview analyst AI.

Return STRICTLY this JSON:

{
  "matchScore": number (0-100),
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ]
}

IMPORTANT RULES:
- Do NOT skip any field
- Do NOT return empty object
- Do NOT wrap inside another key
- Do NOT return null
- Do NOT include markdown (no \`\`\`)
- Return ONLY pure JSON

Input:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  try {
    // ✅ Call Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // ✅ Safe extraction
    const rawText =
      result.response?.text?.() ||
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    console.log("🧾 RAW AI RESPONSE:\n", rawText);

    // ✅ Clean markdown if any
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract JSON safely
    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in AI response");
    }

    const finalJson = cleanedText.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(finalJson);

    console.log("🧠 PARSED AI OUTPUT:", parsed);

    // ✅ Fallback defaults (VERY IMPORTANT)
    const safeParsed = {
      matchScore: Number(parsed.matchScore) || 0,
      technicalQuestions: parsed.technicalQuestions || [],
      behavioralQuestions: parsed.behavioralQuestions || [],
      skillGaps: parsed.skillGaps || [],
      preparationPlan: parsed.preparationPlan || [],
    };

    // ✅ Validate with Zod
    const validatedData = interviewReportSchema.parse(safeParsed);

    return validatedData;

  } catch (err) {
    console.error("❌ AI SERVICE ERROR:", err);
    throw new Error("Failed to generate interview report");
  }
}

module.exports = generateInterviewReport;