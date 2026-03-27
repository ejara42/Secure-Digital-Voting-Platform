const express = require("express");
const router = express.Router();
const { chatWithCandidate } = require("../controllers/aiController");

// POST /api/ai/chat/:candidateId
// Public endpoint - voters don't need to be logged in to chat
router.post("/chat/:candidateId", chatWithCandidate);

module.exports = router;
