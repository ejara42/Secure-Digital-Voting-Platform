require("dotenv").config();
const Voter = require("../models/Voter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
    try {
        const { password } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        await Voter.create({
            ...req.body,
            password: hashed,
        });

        return res.status(201).json({
            message: "Registration successful",
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        // 🔐 Duplicate key (email / phone / nationalId)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                message: `${field} already exists`,
            });
        }

        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log('Login attempt:', { identifier, passwordLength: password.length });

        const voter = await Voter.findOne({
            $or: [{ email: identifier }, { nationalId: identifier }],
        });
        console.log('User found:', !!voter);

        if (!voter) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const match = await bcrypt.compare(password, voter.password);
        console.log('Password match:', match);
        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: voter._id, role: voter.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            role: voter.role,
            voter: {
                id: voter._id,
                fullName: voter.fullName,
                email: voter.email,
                nationalId: voter.nationalId,
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message: "Login failed",
        });
    }
};

// =========================
// FORGOT PASSWORD
// =========================
exports.forgotPassword = async (req, res) => {
    try {
        const { identifier } = req.body;

        const voter = await Voter.findOne({
            $or: [{ email: identifier }, { nationalId: identifier }],
        });

        // 🔒 Security: do not reveal account existence
        if (!voter) {
            return res.json({
                message: "If the account exists, an email was sent.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        voter.resetPasswordToken = token;
        voter.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await voter.save();

        // ✅ FIXED VARIABLE NAME
        const resetURL =
            `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${voter._id}`;

        const { sendEmail } = require("../utils/email");
        
        console.log(`📩 Processing forgot password for: ${voter.email}`);
        
        try {
            await sendEmail({
                to: voter.email,
                subject: "Password Reset",
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #2563eb;">Password Reset Request</h2>
                        <p>We received a request to reset your password for the Secure Digital Voting Platform.</p>
                        <p>Click the button below to set a new password:</p>
                        <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; font-size: 0.8em; color: #000;">${resetURL}</p>
                        <p style="margin-top: 20px; border-top: 1px solid #eee; pt-10px; font-size: 0.8em; color: #999;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `,
            });
        } catch (emailErr) {
            // Log the error but don't crash or return 500 if we want to remain "graceful"
            // Actually, if we want the user to KNOW it failed (on the server side at least)
            console.error("❌ Email send process aborted due to error:", emailErr.message);
        }

        return res.json({
            message: "If the account exists, an email was sent.",
        });

    } catch (error) {
        // 🔴 CRITICAL: Log actual error to help debugging on Render/Vercel logs
        console.error("FORGOT PASSWORD ERROR LOG:", {
            message: error.message,
            stack: error.stack,
            identifier: req.body.identifier,
        });

        return res.status(500).json({
            message: "Unable to process request",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};


// =========================
// RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
    try {
        const { userId, token, newPassword } = req.body;

        const voter = await Voter.findOne({
            _id: userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!voter) {
            return res.status(400).json({
                message: "Invalid or expired token",
            });
        }

        voter.password = await bcrypt.hash(newPassword, 10);
        voter.resetPasswordToken = null;
        voter.resetPasswordExpires = null;

        await voter.save();

        return res.json({
            message: "Password reset successful",
        });

    } catch (error) {
        // 🔴 CRITICAL: Log actual error
        console.error("RESET PASSWORD ERROR LOG:", {
            message: error.message,
            stack: error.stack,
            userId: req.body.userId,
        });

        // Handle malformed ObjectId errors gracefully
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        return res.status(500).json({
            message: "Unable to reset password",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
