const Ballot = require("../models/Ballot");
const Candidate = require("../models/Candidate");

/**
 * LIST ALL BALLOTS
 */
const listBallots = async (req, res) => {
    try {
        const ballots = await Ballot.find().sort({ createdAt: -1 });
        res.json(ballots);
    } catch (err) {
        console.error("listBallots error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * DROPDOWN BALLOTS
 */
const ballotDropdown = async (req, res) => {
    try {
        const ballots = await Ballot.find({}, { title: 1 });
        res.json(ballots);
    } catch (err) {
        console.error("ballotDropdown error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * CREATE BALLOT
 */
const createBallot = async (req, res) => {
    try {
        const {
            title,
            electionName,
            year,
            description,
            startDate,
            endDate
        } = req.body;

        if (!title || !electionName || !year || !startDate || !endDate) {
            return res.status(400).json({
                message: "Title, election name, year, start date and end date are required"
            });
        }

        const ballot = await Ballot.create({
            title,
            electionName,
            year,
            description,
            startDate,
            endDate
        });

        res.status(201).json(ballot);
    } catch (err) {
        console.error("createBallot error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


/**
 * GET CANDIDATES FOR A BALLOT
 */
const ballotCandidates = async (req, res) => {
    try {
        const ballotId = req.params.id;
        if (!ballotId) return res.status(400).json({ message: "Ballot ID is required" });

        const ballot = await Ballot.findById(ballotId);
        if (!ballot) return res.status(404).json({ message: "Ballot not found" });

        const candidates = await Candidate.find({ ballot: ballotId })
            .populate("ballot", "title year")
            .sort({ name: 1 });

        res.json({ ballot, candidates });
    } catch (err) {
        console.error("ballotCandidates error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getBallot = async (req, res) => {
    try {
        const ballot = await Ballot.findById(req.params.id);
        if (!ballot) return res.status(404).json({ message: "Ballot not found" });
        res.json(ballot);
    } catch (err) {
        console.error("getBallot error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    listBallots,
    ballotDropdown,
    createBallot,
    ballotCandidates,
    getBallot,
};
