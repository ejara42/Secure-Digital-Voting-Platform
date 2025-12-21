// backend/controllers/fraudController.js
const Vote = require('../models/vote');
const AuditLog = require('../models/AuditLog');

const suspiciousVoters = async (req, res) => {
    try {
        // Example: find voters with >1 vote in DB (shouldn't happen if index works)
        const duplicates = await Vote.aggregate([
            { $group: { _id: { voter: '$voter', election: '$election' }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $project: { voter: '$_id.voter', election: '$_id.election', count: 1 } }
        ]);
        res.json({ suspicious: duplicates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { suspiciousVoters };
