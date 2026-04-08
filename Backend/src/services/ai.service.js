const Groq = require("groq-sdk")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert career coach and interview preparation specialist.

Analyze the following candidate details and generate a comprehensive interview report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY a valid JSON object with exactly these fields:
{
    "matchScore": <number between 0 and 100>,
    "title": "<job title>",
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
        model: "llama3-8b-8192",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 2000,
    })

    const content = response.choices[0].message.content.trim()

    // Remove markdown if AI adds it
    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    return JSON.parse(cleaned)
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert resume writer.

Create a professional, ATS-friendly resume in HTML format for this candidate:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY a valid JSON object with this exact field:
{
    "html": "<complete HTML resume here>"
}

Requirements for the HTML resume:
- Professional and clean design
- ATS friendly
- 1-2 pages when printed
- Highlight relevant experience for the job
- Use simple colors and formatting
- Do NOT sound AI generated

Return ONLY the JSON. No extra text.`

    const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 3000,
    })

    const content = response.choices[0].message.content.trim()

    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    const jsonContent = JSON.parse(cleaned)

    // Return HTML content directly instead of PDF
    return jsonContent.html
}

module.exports = { generateInterviewReport, generateResumePdf }