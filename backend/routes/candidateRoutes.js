const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    listCandidates,
    getCandidatesByBallot,
    createCandidate,
    updateCandidate,
    deleteCandidate
} = require("../controllers/candidateController");

const auth = require("../middleware/authMiddleware");       // Protect admin routes
const adminOnly = require("../middleware/adminMiddleware"); // Only admins

// Setup multer for photo upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// PUBLIC ROUTES
router.get("/", listCandidates);                    // List all
router.get("/ballot/:ballotId", getCandidatesByBallot); // By ballot
router.get("/:ballotId", getCandidatesByBallot);

// ADMIN ROUTES
router.post("/", auth, adminOnly, upload.single("photo"), createCandidate);
router.put("/:id", auth, adminOnly, upload.single("photo"), updateCandidate);
router.delete("/:id", auth, adminOnly, deleteCandidate);

module.exports = router;
