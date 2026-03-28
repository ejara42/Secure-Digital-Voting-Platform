const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        party: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },
        manifesto: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: "",
        },
        position: {
            type: String,
            trim: true,
            default: "Presidential Candidate",
        },
        region: {
            type: String,
            trim: true,
            default: "Nationwide",
        },
        slogan: {
            type: String,
            trim: true,
            maxlength: 200,
            default: "",
        },
        photo: {
            type: String,
            default: null,
        },
        ballot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ballot",
            required: true,
        },
        votes: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index for fast lookup by ballot
candidateSchema.index({ ballot: 1 });
candidateSchema.index({ ballot: 1, name: 1 }, { unique: true });

// Virtual: photo URL
candidateSchema.virtual("photoUrl").get(function () {
    if (!this.photo) return null;
    if (this.photo.startsWith("http")) return this.photo;
    return `/uploads/${this.photo}`;
});

candidateSchema.set("toJSON", { virtuals: true });

module.exports =
    mongoose.models.Candidate ||
    mongoose.model("Candidate", candidateSchema);
