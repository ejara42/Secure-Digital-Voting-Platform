const Candidate = require("../models/Candidate");
const Ballot = require("../models/Ballot");
const fs = require("fs");
const path = require("path");

// GET all candidates (optionally by ballot)
exports.listCandidates = async (req, res) => {
    try {
        const { ballotId } = req.query;
        const filter = ballotId ? { ballot: ballotId } : {};
        const candidates = await Candidate.find(filter).sort({ name: 1 });
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch candidates" });
    }
};

// GET candidates by ballot (route param)
exports.getCandidatesByBallot = async (req, res) => {
    try {
        const { ballotId } = req.params;
        if (!ballotId) return res.status(400).json({ message: "Ballot ID required" });

        const candidates = await Candidate.find({ ballot: ballotId }).sort({ name: 1 });
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch candidates" });
    }
};

// CREATE a new candidate (admin)
exports.createCandidate = async (req, res) => {
    try {
        const { name, party, ballot, description, vision } = req.body;

        if (!name || !party || !ballot) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate ballot exists
        const ballotExists = await Ballot.findById(ballot);
        if (!ballotExists) {
            return res.status(400).json({ message: "Invalid ballot" });
        }

        // Prevent duplicate candidate in same ballot
        const duplicate = await Candidate.findOne({ name, ballot });
        if (duplicate) {
            return res.status(400).json({ message: "Candidate already exists in this ballot" });
        }

        const candidateData = {
            name,
            party,
            ballot,
            description,
            vision,
            photo: req.file?.filename
        };

        const candidate = await Candidate.create(candidateData);
        res.status(201).json(candidate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Candidate creation failed" });
    }
};

// UPDATE candidate
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        const { name, ballot } = req.body;
        if (name || ballot) {
            // Prevent duplicate on update
            const duplicate = await Candidate.findOne({
                name: name || candidate.name,
                ballot: ballot || candidate.ballot,
                _id: { $ne: candidate._id },
            });
            if (duplicate) return res.status(400).json({ message: "Candidate already exists in this ballot" });
        }

        Object.assign(candidate, req.body);

        // Replace photo if uploaded
        if (req.file) {
            if (candidate.photo) {
                const old = path.join("uploads", candidate.photo);
                fs.existsSync(old) && fs.unlinkSync(old);
            }
            candidate.photo = req.file.filename;
        }

        await candidate.save();
        res.json(candidate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Candidate update failed" });
    }
};

// DELETE candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (candidate.photo) {
            const p = path.join("uploads", candidate.photo);
            fs.existsSync(p) && fs.unlinkSync(p);
        }

        await candidate.deleteOne();
        res.json({ message: "Candidate deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Candidate deletion failed" });
    }
};
