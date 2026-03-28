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
        
        await sendEmail({
            to: voter.email,
            subject: "Password Reset",
            html: `
                <h3>Password Reset Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${resetURL}">${resetURL}</a>
                <p>This link expires in 15 minutes.</p>
            `,
        });

        return res.json({
            message: "If the account exists, an email was sent.",
        });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Unable to process request",
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
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Unable to reset password",
        });
    }
};
