require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const ballotRoutes = require('./routes/ballotRoutes');
const voteRoutes = require('./routes/voteRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const resultRoutes = require('./routes/resultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rateLimiter = require('./middleware/rateLimiter');

function createApp({ io } = {}) {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic rate limiter attached to API routes
  app.use('/api/', rateLimiter);

  // mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ballots', ballotRoutes);
  app.use('/api/votes', voteRoutes);
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/results', resultRoutes);
  app.use('/api/admin', adminRoutes);

  // Health endpoint (admin-only)
  const { health } = require('./controllers/healthController');
  const auth = require('./middleware/authMiddleware');
  const admin = require('./middleware/adminMiddleware');
  app.get('/api/admin/health', auth, admin, health);

  // expose socket.io (may be undefined in tests)
  if (io) app.set('io', io);

  return app;
}

module.exports = { createApp };
