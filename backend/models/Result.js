const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    ballotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        required: true,
        index: true,
    },

    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
        index: true,
    },

    votes: {
        type: Number,
        default: 0,
    },

    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

// Prevent duplicate candidate result per ballot
ResultSchema.index({ ballotId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("Result", ResultSchema);
