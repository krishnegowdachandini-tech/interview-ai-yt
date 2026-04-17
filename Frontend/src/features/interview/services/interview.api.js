import axios from "axios";

const api = axios.create({
    baseURL: "https://interview-ai-yt.onrender.com",
    withCredentials: true,
})

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    try {
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription || "")
        if (resumeFile) {
            formData.append("resume", resumeFile)
        }

        const response = await api.post("/api/interview/", formData)
        return response.data
    } catch (err) {
        console.log("Generate report error:", err)
        throw err
    }
}

export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (err) {
        console.log("Get report error:", err)
        throw err
    }
}

export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/")
        return response.data
    } catch (err) {
        console.log("Get all reports error:", err)
        throw err
    }
}

export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(
            `/api/interview/resume/pdf/${interviewReportId}`,
            null,
            { responseType: "blob" }
        )
        return response.data
    } catch (err) {
        console.log("Generate PDF error:", err)
        throw err
    }
}