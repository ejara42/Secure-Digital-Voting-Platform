const Vote = require("../models/vote");
const mongoose = require("mongoose");

// GET /api/results/:ballotId
exports.getResults = async (req, res) => {
    try {
        const { ballotId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(ballotId)) {
            return res.status(400).json({ message: "Invalid ballot ID" });
        }

        const results = await Vote.aggregate([
            { $match: { election: new mongoose.Types.ObjectId(ballotId) } },

            { $group: { _id: "$candidate", votes: { $sum: 1 } } },

            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate",
                },
            },

            {
                $unwind: {
                    path: "$candidate",
                    preserveNullAndEmptyArrays: false, // prevents crash
                },
            },

            {
                $project: {
                    candidateId: "$candidate._id",
                    candidateName: "$candidate.name",
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
            totalVoters: 0,
            turnoutPercent: 0,
        });
    } catch (err) {
        console.error("getResults error:", err);
        res.status(500).json({ message: "Failed to fetch results" });
    }
};

// GET /api/results
exports.getAllResults = async (req, res) => {
    try {
        const results = await Vote.aggregate([
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
                    _id: "$candidate._id",
                    name: "$candidate.name",
                    party: "$candidate.party",
                    votes: 1,
                },
            },
            { $sort: { votes: -1 } },
        ]);

        res.json(results);
    } catch (err) {
        console.error("getAllResults error:", err);
        res.status(500).json({ message: "Failed to fetch results" });
    }
};
