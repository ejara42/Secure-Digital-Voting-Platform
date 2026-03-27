const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Vote = require("../models/vote");
const {
    castVote,
    checkVoteStatus,
    sendOTP,
} = require("../controllers/voteController");

// Send OTP before voting
router.post("/otp", auth, sendOTP);

// Cast vote (requires valid OTP in body)
router.post("/", auth, castVote);

// Check if voter already voted in a ballot
router.get("/status/:ballotId", auth, checkVoteStatus);

// Get total vote count (public stats endpoint)
router.get("/count", async (req, res) => {
    try {
        const count = await Vote.countDocuments();
        res.json({ totalVotes: count });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch vote count" });
    }
});

module.exports = router;
