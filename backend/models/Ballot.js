// models/Ballot.js
const mongoose = require("mongoose");

const ballotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Ballot", ballotSchema);
