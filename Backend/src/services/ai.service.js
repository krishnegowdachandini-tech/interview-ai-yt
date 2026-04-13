const Groq = require("groq-sdk")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert career coach and interview preparation specialist.

Analyze the following candidate details and generate a comprehensive report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY a valid JSON object with exactly these fields:
{
    "matchScore": <number between 0 and 100>,
    "resumeScore": <number between 0 and 100>,
    "atsScore": <number between 0 and 100>,
    "title": "<job title>",
    "summary": "<2-3 sentence assessment of candidate>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
    "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
    "suggestedRoles": ["<role 1>", "<role 2>", "<role 3>"],
    "technicalQuestions": [
        {
            "question": "<technical question>",
            "intention": "<why interviewer asks this>",
            "answer": "<how to answer this question>"
        }
    ],
    "behavioralQuestions": [
        {
            "question": "<behavioral question>",
            "intention": "<why interviewer asks this>",
            "answer": "<how to answer this question>"
        }
    ],
    "skillGaps": [
        {
            "skill": "<missing skill>",
            "severity": "<low or medium or high>"
        }
    ],
    "preparationPlan": [
        {
            "day": <day number>,
            "focus": "<focus area for this day>",
            "tasks": ["<task 1>", "<task 2>"]
        }
    ]
}

Return ONLY the JSON. No extra text, no markdown, no explanation.`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
    })

    const content = response.choices[0].message.content.trim()
    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    return JSON.parse(cleaned)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert resume writer.

Create a professional ATS-friendly resume in HTML format for this candidate:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY a valid JSON object:
{
    "html": "<complete HTML resume here>"
}

Requirements:
- Professional and clean design
- ATS friendly
- 1-2 pages when printed
- Highlight relevant experience
- Simple colors and formatting

Return ONLY the JSON. No extra text.`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
    })

    const content = response.choices[0].message.content.trim()
    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    const jsonContent = JSON.parse(cleaned)
    return jsonContent.html
}

module.exports = { generateInterviewReport, generateResumePdf }