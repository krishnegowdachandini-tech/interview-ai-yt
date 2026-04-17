const Groq = require("groq-sdk")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert career coach and interview preparation specialist with 15 years of experience.

Analyze the following candidate details and generate a comprehensive interview report.

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
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>", "<strength 5>"],
    "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>", "<improvement 5>"],
    "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
    "suggestedRoles": ["<role 1>", "<role 2>", "<role 3>"],
    "technicalQuestions": [
        {
            "question": "<technical question 1>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 2>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 3>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 4>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 5>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 6>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 7>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 8>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 9>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        },
        {
            "question": "<technical question 10>",
            "intention": "<why interviewer asks this>",
            "answer": "<detailed technical answer>"
        }
    ],
    "behavioralQuestions": [
        {
            "question": "<behavioral question 1>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 2>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 3>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 4>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 5>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 6>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 7>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 8>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 9>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        },
        {
            "question": "<behavioral question 10>",
            "intention": "<why interviewer asks this>",
            "answer": "Situation: <describe a specific situation> | Task: <describe your responsibility> | Action: <describe what you did step by step> | Result: <describe the outcome and impact>"
        }
    ],
    "skillGaps": [
        {
            "skill": "<missing skill 1>",
            "severity": "<low or medium or high>"
        },
        {
            "skill": "<missing skill 2>",
            "severity": "<low or medium or high>"
        },
        {
            "skill": "<missing skill 3>",
            "severity": "<low or medium or high>"
        },
        {
            "skill": "<missing skill 4>",
            "severity": "<low or medium or high>"
        },
        {
            "skill": "<missing skill 5>",
            "severity": "<low or medium or high>"
        }
    ],
    "preparationPlan": [
        {
            "day": 1,
            "focus": "<focus area for day 1>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 2,
            "focus": "<focus area for day 2>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 3,
            "focus": "<focus area for day 3>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 4,
            "focus": "<focus area for day 4>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 5,
            "focus": "<focus area for day 5>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 6,
            "focus": "<focus area for day 6>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        },
        {
            "day": 7,
            "focus": "<focus area for day 7>",
            "tasks": ["<task 1>", "<task 2>", "<task 3>"]
        }
    ]
}

IMPORTANT:
- Generate exactly 10 technical questions and 10 behavioral questions
- For behavioral questions ALWAYS use STAR method format:
  "Situation: [context] | Task: [responsibility] | Action: [what you did] | Result: [outcome]"
- For technical questions give detailed technical answers
- Make questions specific to the job description and resume provided
- Return ONLY the JSON. No extra text, no markdown, no explanation.`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 6000,
    })

    const content = response.choices[0].message.content.trim()
    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    return JSON.parse(cleaned)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert resume writer with 15 years of experience.

Create a professional ATS-friendly resume in HTML format for this candidate:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY a valid JSON object:
{
    "html": "<complete HTML resume here>"
}

Requirements for the HTML resume:
- Professional and clean design
- ATS friendly formatting
- 1-2 pages when printed
- Highlight relevant experience for the job
- Use simple professional colors
- Do NOT sound AI generated
- Include all sections: Summary, Experience, Skills, Education

Return ONLY the JSON. No extra text, no markdown.`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
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