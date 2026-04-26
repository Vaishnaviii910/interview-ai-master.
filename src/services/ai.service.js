const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")


// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });


// ✅ Zod Schema (MATCH VIDEO ORDER)
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

  // ✅ IMPORTANT: title at end (same as video)
  title: z.string().describe("The title of the job for which the interview report is generated"),
});


// ✅ MAIN FUNCTION
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate an interview report for a candidate.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return STRICT JSON:

{
  "matchScore": number,
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
  ],
  "title": string
}

IMPORTANT RULES:
- Do NOT skip any field
- Keep title at the end
- Do NOT return null
- Do NOT wrap response
- No markdown
- ONLY JSON
IMPORTANT:
- Do NOT leave "answer" empty
- Every question MUST have a detailed answer
- Answer should explain how to respond in interview
`;

  try {
    // ✅ Gemini call
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // ✅ Extract response safely
    const rawText =
      result.response?.text?.() ||
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    console.log("🧾 RAW AI RESPONSE:\n", rawText);

    // ✅ Clean response
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract JSON block
    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in AI response");
    }

    const finalJson = cleanedText.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(finalJson);

    console.log("🧠 PARSED OUTPUT:", parsed);

    // ✅ SAFE FALLBACK (VERY IMPORTANT)
    const safeParsed = {
      matchScore: Number(parsed.matchScore) || 0,
      technicalQuestions: parsed.technicalQuestions || [],
      behavioralQuestions: parsed.behavioralQuestions || [],
      skillGaps: parsed.skillGaps || [],
      preparationPlan: parsed.preparationPlan || [],
      title: parsed.title ?? "Interview Report",
    };

    // ✅ Zod validation
    const validatedData = interviewReportSchema.parse(safeParsed);

    return validatedData;

  } catch (err) {
    console.error("❌ AI SERVICE ERROR:", err);
    throw new Error("Failed to generate interview report");
  }
}

async function generatePdfFromHtml(htmlContent){
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.setContent(htmlContent,{waitUntil:"networkidle0"})

  const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })
    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({resume,selfDescription,jobDescription}){
   
  const resumePdfSchmea = z.object({
      html:z.string().describe("The HTML content of the resume which can be converted to pdf using any library like puppeteer")
  })

  const prompt = `Generate resume for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}

                    
                    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                    The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                    you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description. 
                    `

  const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: "application/json"
  }
});

const rawText =
  result.response?.text?.() ||
  result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
  "";

const cleanedText = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const jsonContent = JSON.parse(cleanedText); // ✅ only one

const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

return pdfBuffer;
}


module.exports = {generateInterviewReport,generateResumePdf}; 