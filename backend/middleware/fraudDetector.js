// backend/middleware/fraudDetector.js
module.exports = (req, res, next) => {
    try {
        // Basic heuristics: block if too many votes from same IP in last X seconds
        // For production, back this with Redis counters.
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // quick in-memory store — fine for low traffic dev, use Redis for prod
        if (!global.__ipCounts) global.__ipCounts = {};
        const now = Date.now();
        global.__ipCounts[ip] = (global.__ipCounts[ip] || []).filter(ts => now - ts < 60000); // keep 1min
        if (global.__ipCounts[ip].length > 10) {
            return res.status(429).json({ message: 'Too many requests from this IP' });
        }
        global.__ipCounts[ip].push(now);
        next();
    } catch (err) {
        next();
    }
};
