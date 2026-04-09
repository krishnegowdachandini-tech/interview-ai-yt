const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report
 */
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
            message: "Failed to generate interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId
 */
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
            message: "Failed to fetch interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get all interview reports
 */
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
            message: "Failed to fetch interview reports.",
            error: error.message
        })
    }
}

/**
 * @description Controller to generate resume PDF
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const htmlContent = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        })

        // Send HTML instead of PDF
        res.set({ "Content-Type": "text/html" })
        res.send(htmlContent)

    } catch (error) {
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