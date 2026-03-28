const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const Otp = require("../models/Otp");
const AuditLog = require("../models/AuditLog");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");
const { sendOTPSms } = require("../utils/sms");

// ─── Helper: generate 6-digit OTP ─────────────────────
const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/votes/otp  ──────────────────────────────
exports.sendOTP = async (req, res) => {
    try {
        const voterId = req.user.id;
        const { electionId } = req.body;

        if (!electionId) {
            return res.status(400).json({ message: "electionId is required" });
        }

        const voter = await Voter.findById(voterId);
        if (!voter) return res.status(404).json({ message: "Voter not found" });

        // Prevent duplicate OTP spam — delete any existing OTP
        await Otp.deleteMany({ voterId, electionId });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await Otp.create({ voterId, electionId, otp, expiresAt });

        // ── Send via Email ──────────────────────────────
        const emailSent = await sendEmail({
            to: voter.email,
            subject: "ENBE Digital Election — Your OTP Code",
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
                  <h2 style="color: #2563eb;">🗳️ Your Voting OTP</h2>
                  <p>Dear <strong>${voter.fullName}</strong>,</p>
                  <p>Your One-Time Password for the ENBE Digital Election is:</p>
                  <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669;
                              padding: 20px; background: #f0fdf4; border-radius: 8px; text-align: center;">
                    ${otp}
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">
                    This code expires in <strong>10 minutes</strong>. Do NOT share it with anyone.
                  </p>
                  <p style="color: #6b7280; font-size: 12px;">Ethiopia National Election Board (ENBE)</p>
                </div>
            `,
        }).catch(() => false);

        // ── Send via SMS (Africa's Talking) ─────────────
        if (voter.phone) {
            sendOTPSms(voter.phone, otp).catch(() => {
                console.warn("[OTP] SMS delivery failed, email was used as fallback");
            });
        }

        // ── Audit log ───────────────────────────────────
        await AuditLog.create({
            event: "OTP_SENT",
            actor: voterId,
            meta: { electionId, channel: voter.phone ? "email+sms" : "email" },
        }).catch(() => { });

        res.json({ message: "OTP sent to your registered email and phone" });
    } catch (err) {
        console.error("sendOTP error:", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

// ─── POST /api/votes  ─────────────────────────────────
exports.castVote = async (req, res) => {
    try {
        const voterId = req.user.id;
        // Accept both "ballotId" (legacy frontend) and "electionId" (new flow)
        const electionId = req.body.electionId || req.body.ballotId;
        const { candidateId, otp } = req.body;

        if (!electionId || !candidateId) {
            return res.status(400).json({ message: "ballotId/electionId and candidateId are required" });
        }

        // ── OTP validation (only if OTP was provided) ─────────────
        if (otp) {
            const otpRecord = await Otp.findOne({ voterId, electionId });
            if (!otpRecord) {
                await AuditLog.create({ event: "VOTE_INVALID_OTP", actor: voterId, meta: { electionId } }).catch(() => { });
                return res.status(400).json({ message: "OTP not found. Request a new one." });
            }
            if (new Date() > otpRecord.expiresAt) {
                await otpRecord.deleteOne();
                await AuditLog.create({ event: "VOTE_INVALID_OTP", actor: voterId, meta: { electionId, reason: "expired" } }).catch(() => { });
                return res.status(400).json({ message: "OTP has expired. Please request a new one." });
            }
            if (otpRecord.otp !== otp) {
                await AuditLog.create({ event: "VOTE_INVALID_OTP", actor: voterId, metadata: { electionId, reason: "wrong_otp" } }).catch(() => { });
                return res.status(400).json({ message: "Invalid OTP." });
            }
            await otpRecord.deleteOne(); // consume OTP
        }

        // ── Check duplicate vote ─────────────────────────
        const existingVote = await Vote.findOne({ voterId, election: electionId });
        if (existingVote) {
            return res.status(409).json({ message: "You have already voted in this election." });
        }

        // ── Generate tamper-proof receipt ────────────────
        const secret = process.env.RECEIPT_SECRET || "default-receipt-secret";
        const receipt = crypto
            .createHmac("sha256", secret)
            .update(`${voterId}-${electionId}-${candidateId}-${Date.now()}`)
            .digest("hex");

        // ── Save vote ────────────────────────────────────
        await Vote.create({ voterId, election: electionId, candidate: candidateId, receipt });

        // ── Increment candidate vote count ───────────────
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

        // ── Real-time update ─────────────────────────────
        const io = req.app.get("io");
        if (io) {
            io.emit("resultsUpdated", { electionId });
            io.emit("voteCast", { candidateId, electionId });
        }

        // ── Audit log ─────────────────────────────────────
        await AuditLog.create({
            event: "VOTE_CAST",
            actor: voterId,
            meta: { electionId, candidateId },
        }).catch(() => { });

        res.json({ receipt, message: "Your vote has been recorded successfully." });
    } catch (err) {
        console.error("castVote error:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate vote blocked." });
        }
        res.status(500).json({ message: "Vote submission failed." });
    }
};

// ─── GET /api/votes/status/:ballotId ─────────────────
exports.checkVoteStatus = async (req, res) => {
    try {
        const voterId = req.user.id;
        const { ballotId } = req.params;

        const vote = await Vote.findOne({ voterId, election: ballotId });
        res.json({ voted: !!vote, receipt: vote?.receipt || null });
    } catch (err) {
        console.error("Vote status error:", err);
        res.status(500).json({ voted: false });
    }
};
