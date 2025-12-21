/**
 * Archives audit logs to S3 (intended for CI or cron runs)
 * Usage: node scripts/archiveAudits.js
 * Requires env: MONGO_URI, AWS_* (or configured in environment), AUDIT_S3_BUCKET
 */

const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const { uploadNdjsonStream } = require('../utils/s3');

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is required');
  if (!process.env.AUDIT_S3_BUCKET) throw new Error('AUDIT_S3_BUCKET is required');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  const now = new Date();
  const key = `audits/archive-${now.toISOString().replace(/[:.]/g, '-')}.ndjson`;
  console.log('Preparing upload to S3 key:', key);

  const { pass, uploadPromise } = await uploadNdjsonStream(key);

  // stream audit logs
  (async () => {
    try {
      const cursor = AuditLog.find().cursor();
      for await (const doc of cursor) {
        pass.write(JSON.stringify(doc.toObject()) + '\n');
      }
    } catch (e) {
      console.error('Error streaming audits:', e.message || e);
    } finally {
      pass.end();
    }
  })();

  console.log('Waiting for S3 upload to finish...');
  await uploadPromise;
  console.log('Audit archival finished:', key);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Archive failed:', err && err.message ? err.message : err);
  process.exit(1);
});
