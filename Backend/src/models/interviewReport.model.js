const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false })

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String },
    selfDescription: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: { type: String },

    // ── Interview Prep Fields ──
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],

    // ── Resume Analyzer Fields ──
    resumeScore: { type: Number, min: 0, max: 100 },
    atsScore: { type: Number, min: 0, max: 100 },
    summary: { type: String },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestedRoles: [{ type: String }],

}, { timestamps: true })

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel