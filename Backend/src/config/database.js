const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4  // Force IPv4
        })
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("DB Error:", err.message)
    }
}

module.exports = connectToDB