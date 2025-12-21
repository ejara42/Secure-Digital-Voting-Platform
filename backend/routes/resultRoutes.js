const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/", auth, adminOnly, async (req, res) => {
    try {
        const results = await Candidate.find()
            .populate("ballot", "title year")
            .sort({ votes: -1 });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
