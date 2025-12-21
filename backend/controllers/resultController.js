const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Result = require("../models/Result");

// GET results for a specific election/ballot
exports.getResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        if (!electionId) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const results = await Vote.aggregate([
            { $match: { election: electionId } },
            { $group: { _id: "$candidate", votes: { $sum: 1 } } },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate",
                },
            },
            { $unwind: "$candidate" },
            {
                $project: {
                    _id: 0,
                    candidateId: "$candidate._id",
                    candidateName: "$candidate.name", // renamed for frontend
                    party: "$candidate.party",
                    votes: 1,
                },
            },
            { $sort: { votes: -1 } },
        ]);

        const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

        res.json({
            results,
            totalVotes,
            totalVoters: 0, // optionally fetch from Voter collection
            turnoutPercent: 0, // optionally calculate
        });
    } catch (err) {
        console.error("getResults error:", err);
        res.status(500).json({ message: "Failed to fetch results" });
    }
};

// POST /results/recalculate/:electionId
exports.recalculateResults = async (req, res) => {
    try {
        const { electionId } = req.params;
        const io = req.app.get("io"); // socket.io instance

        const results = await Vote.aggregate([
            { $match: { election: electionId } },
            { $group: { _id: "$candidate", votes: { $sum: 1 } } },
        ]);

        // Update cached Result collection
        for (const r of results) {
            await Result.findOneAndUpdate(
                { electionId, candidateId: r._id },
                { votes: r.votes, lastUpdated: Date.now() },
                { upsert: true, new: true }
            );
        }

        // Broadcast to socket room
        io.to(electionId.toString()).emit("resultsUpdated", results);

        res.json({ message: "Results recalculated & broadcasted", results });
    } catch (err) {
        console.error("recalculateResults error:", err);
        res.status(500).json({ message: "Recalculate failed" });
    }
};
