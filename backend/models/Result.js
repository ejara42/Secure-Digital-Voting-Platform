// backend/models/Result.js
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    votes: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
