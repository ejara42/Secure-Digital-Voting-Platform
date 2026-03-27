const mongoose = require("mongoose");

const ballotSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        year: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["Presidential", "Parliamentary", "Senate", "Local", "Referendum", "Other"],
            default: "Presidential",
        },
        region: {
            type: String,
            trim: true,
            default: "Federal",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        totalRegisteredVoters: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Index for active ballot lookups
ballotSchema.index({ isActive: 1 });
ballotSchema.index({ year: -1 });

// Virtual: whether the election is currently open
ballotSchema.virtual("isOpen").get(function () {
    const now = new Date();
    return this.isActive && this.startDate <= now && this.endDate >= now;
});

ballotSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Ballot", ballotSchema);
