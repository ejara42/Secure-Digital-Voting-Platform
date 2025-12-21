const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    castVote,
    checkVoteStatus
} = require("../controllers/voteController");

router.post("/", auth, castVote);
router.get("/status/:ballotId", auth, checkVoteStatus);

module.exports = router;
