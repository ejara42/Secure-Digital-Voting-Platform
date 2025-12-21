// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
let RedisStore;
try {
    // optional dependency for production distributed rate-limiting
    RedisStore = require('rate-limit-redis');
} catch (e) {
    RedisStore = null;
}

const redisUrl = process.env.REDIS_URL;

const createLimiter = () => {
    const opts = {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // default 1 min
        max: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests, please try again later.'
    };

    if (redisUrl && RedisStore) {
        const Redis = require('redis');
        const client = Redis.createClient({ url: redisUrl });
        // connect client lazily
        client.connect().catch((err) => console.warn('Redis connect failed for rate limiter:', err.message));

        opts.store = new RedisStore({ sendCommand: (...args) => client.sendCommand(args) });
    }

    return rateLimit(opts);
};

module.exports = createLimiter();
