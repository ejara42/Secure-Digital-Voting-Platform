const express = require('express');
const router = express.Router();
const { listVoters } = require('../controllers/voterController');
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.get('/', auth, adminOnly, listVoters);

module.exports = router;
