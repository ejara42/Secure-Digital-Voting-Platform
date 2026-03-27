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
router.get("/:id/meta", getBallot);  // legacy alias
router.get("/:id", getBallot);       // ← NEW: fixes 404 from Candidates.jsx

// ADMIN
router.post("/", auth, adminOnly, createBallot);

module.exports = router;
