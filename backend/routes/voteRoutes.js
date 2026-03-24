const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    castVote,
    checkVoteStatus
} = require("../controllers/voteController");

router.post("/", auth, castVote);
router.get("/status/:ballotId", auth, checkVoteStatus);

router.get("/", auth, async (req, res) => {
    try {
        const count = await Vote.countDocuments();
        res.json({ totalVotes: count });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch votes" });
    }
});


module.exports = router;
