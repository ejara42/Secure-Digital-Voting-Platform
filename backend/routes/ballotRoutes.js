const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
    listBallots,
    ballotDropdown,
    createBallot,
    ballotCandidates,
    getBallot
} = require("../controllers/ballotController");

// PUBLIC
router.get("/", listBallots);
router.get("/dropdown", ballotDropdown);
router.get("/:id/candidates", ballotCandidates);
router.get("/:id/meta", getBallot);

// ADMIN
router.post("/", auth, adminOnly, createBallot);

module.exports = router;
