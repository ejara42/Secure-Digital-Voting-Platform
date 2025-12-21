const mongoose = require('mongoose');
const Redis = require('redis');
const { transporter } = require('../utils/email');

const health = async (req, res) => {
  const out = { mongo: 'unknown', redis: 'skipped', smtp: 'unknown' };

  // Mongo
  try {
    const state = mongoose.connection.readyState; // 0 disconnected,1 connected
    out.mongo = state === 1 ? 'ok' : `state_${state}`;
  } catch (e) {
    out.mongo = 'error';
  }

  // Redis (if configured)
  try {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      const client = Redis.createClient({ url: redisUrl });
      await client.connect();
      const pong = await client.ping();
      out.redis = pong === 'PONG' ? 'ok' : `ping_${pong}`;
      await client.disconnect();
    }
  } catch (e) {
    out.redis = `error:${e.message}`;
  }

  // SMTP
  try {
    // transporter.verify() returns a promise
    await transporter.verify();
    out.smtp = 'ok';
  } catch (e) {
    out.smtp = `error:${e && e.message}`;
  }

  res.json(out);
};

module.exports = { health };
