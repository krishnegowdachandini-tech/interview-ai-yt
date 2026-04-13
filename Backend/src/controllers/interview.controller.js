const pdfParse = require("pdf-parse/lib/pdf-parse.js")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res) {
    try {
        // Parse PDF file
        const pdfData = await pdfParse(req.file.buffer)
        const resumeContent = pdfData.text

        const { selfDescription, jobDescription } = req.body

        // Generate report using AI
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })

        // Save to database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("Error:", error.message)
        res.status(500).json({
            message: "Failed to generate report.",
            error: error.message
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch report.",
            error: error.message
        })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reports.",
            error: error.message
        })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        console.log("Generating resume PDF for:", interviewReportId)

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        console.log("Found report, generating HTML...")

        const { resume, jobDescription, selfDescription } = interviewReport

        if (!resume || !jobDescription) {
            return res.status(400).json({
                message: "Resume or job description missing."
            })
        }

        const htmlContent = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription: selfDescription || ""
        })

        console.log("HTML generated successfully!")

        res.set({ "Content-Type": "text/html" })
        res.send(htmlContent)

    } catch (error) {
        console.error("Resume PDF Error:", error.message)
        res.status(500).json({
            message: "Failed to generate resume.",
            error: error.message
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}