const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { exportAudit } = require('../controllers/adminController');

// Export audit logs (admin only)
router.get('/audit/export', auth, admin, exportAudit);

// Archive audits to S3 (admin only)
const { archiveAuditsToS3, getAuditPresignedUrl } = require('../controllers/adminController');
router.post('/audit/archive', auth, admin, archiveAuditsToS3);

// Get presigned URL to download archived audit file
router.get('/audit/presign', auth, admin, getAuditPresignedUrl);

// List archived audit objects (admin only)
const { listArchivedAudits } = require('../controllers/adminController');
router.get('/audit/list', auth, admin, listArchivedAudits);

module.exports = router;
