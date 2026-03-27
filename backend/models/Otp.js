const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voter",
        required: true
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index to auto-delete after expiresAt
    }
}, { timestamps: true });

// Ensure one OTP per voter per election at a time
otpSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
