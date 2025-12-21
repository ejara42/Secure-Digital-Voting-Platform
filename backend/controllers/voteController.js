const Vote = require("../models/Vote");
const Candidate = require("../models/candidate");
const crypto = require("crypto");

exports.castVote = async (req, res) => {
    try {
        const voterId = req.user.id;
        const { ballotId, candidateId } = req.body;

        if (!voterId || !ballotId || !candidateId) {
            return res.status(400).json({ message: "Invalid vote data" });
        }

        const existingVote = await Vote.findOne({
            voterId,
            election: ballotId
        });

        if (existingVote) {
            return res.status(409).json({ message: "You already voted" });
        }

        const receipt = crypto
            .createHash("sha256")
            .update(`${voterId}-${ballotId}-${Date.now()}`)
            .digest("hex");

        await Vote.create({
            voterId,
            election: ballotId,
            candidate: candidateId,
            receipt
        });

        await Candidate.findByIdAndUpdate(candidateId, {
            $inc: { votes: 1 }
        });

        res.status(201).json({ receipt });

    } catch (err) {
        console.error("Vote error:", err);

        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate vote blocked" });
        }

        res.status(500).json({ message: "Vote failed" });
    }
};

exports.checkVoteStatus = async (req, res) => {
    try {
        const voterId = req.user.id;
        const { ballotId } = req.params;

        const vote = await Vote.findOne({
            voterId,
            election: ballotId
        });

        res.json({ voted: !!vote });

    } catch (err) {
        console.error("Vote status error:", err);
        res.status(500).json({ voted: false });
    }
};
