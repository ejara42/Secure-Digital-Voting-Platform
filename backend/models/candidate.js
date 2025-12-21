const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: String,
    party: String,
    description: String,
    photo: String,
    ballot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
});

module.exports =
    mongoose.models.Candidate ||
    mongoose.model("Candidate", candidateSchema);
