// backend/models/AuditLog.js
const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
    event: { type: String, required: true },           // e.g. VOTE_CAST, LOGIN_FAIL
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Voter', default: null },
    meta: { type: Object, default: {} },               // arbitrary metadata
    createdAt: { type: Date, default: Date.now },
    hash: { type: String }                             // chainable hash
});

// Prevent model overwrite in dev
module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditSchema);
