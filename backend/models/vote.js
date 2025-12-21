const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voter",
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    },
    receipt: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

voteSchema.index({ voterId: 1, election: 1 }, { unique: true });

module.exports =
    mongoose.models.Vote || mongoose.model("Vote", voteSchema);
