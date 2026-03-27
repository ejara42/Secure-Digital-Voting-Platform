const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        nationalId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        gender: {
            type: String,
            enum: ["male", "female"],
            required: true
        },

        region: {
            type: String,
            required: true
        },

        dob: {
            type: Date,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["voter", "admin"],
            default: "voter"
        },

        resetPasswordToken: {
            type: String
        },

        resetPasswordExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Prevent model overwrite error
const Voter = mongoose.models.Voter || mongoose.model("Voter", voterSchema);

module.exports = Voter;