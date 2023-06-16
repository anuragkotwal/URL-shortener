const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema(
    {
        urlId: { type: String, required: true },
        originalUrl: { type: String, required: true },
        shortUrl: { type: String, required: true },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Url', urlSchema)
