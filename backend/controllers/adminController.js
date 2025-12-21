const AuditLog = require('../models/AuditLog');
const { uploadNdjsonStream } = require('../utils/s3');
const stream = require('stream');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Stream audit logs as NDJSON or CSV (admin only)
const exportAudit = async (req, res) => {
  try {
    const format = (req.query.format || 'ndjson').toLowerCase();

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.write('event,actor,createdAt,meta,hash\n');
      const cursor = AuditLog.find().cursor();
      for await (const doc of cursor) {
        const row = [
          `"${String(doc.event).replace(/"/g, '""')}"`,
          doc.actor ? String(doc.actor) : '',
          doc.createdAt.toISOString(),
          `"${JSON.stringify(doc.meta).replace(/"/g, '""')}"`,
          doc.hash || ''
        ].join(',') + '\n';
        res.write(row);
      }
      res.end();
      return;
    }

    // default NDJSON
    res.setHeader('Content-Type', 'application/x-ndjson');
    const cursor = AuditLog.find().cursor();
    for await (const doc of cursor) {
      res.write(JSON.stringify(doc.toObject()) + '\n');
    }
    res.end();
  } catch (err) {
    console.error('exportAudit', err);
    res.status(500).json({ message: 'Failed to export audits' });
  }
};

module.exports = { exportAudit };

// Archive audits to S3 (admin only)
const archiveAuditsToS3 = async (req, res) => {
  try {
    const now = new Date();
    const key = `audits/audit-${now.toISOString().replace(/[:.]/g, '-')}.ndjson`;

    const { pass, uploadPromise } = await uploadNdjsonStream(key);

    // stream audits into pass-through
    (async () => {
      try {
        const cursor = AuditLog.find().cursor();
        for await (const doc of cursor) {
          pass.write(JSON.stringify(doc.toObject()) + '\n');
        }
      } catch (e) {
        console.error('error streaming audits to s3 pass-through', e);
      } finally {
        pass.end();
      }
    })();

    // wait for upload to complete
    await uploadPromise;
    res.json({ message: 'Archived audits to S3', key });
  } catch (err) {
    console.error('archiveAuditsToS3', err);
    res.status(500).json({ message: 'Failed to archive audits' });
  }
};

module.exports = { exportAudit, archiveAuditsToS3 };

// Generate a presigned URL for a stored audit file (admin only)
const getAuditPresignedUrl = async (req, res) => {
  try {
    const key = req.query.key || req.body.key;
    if (!key) return res.status(400).json({ message: 'key is required' });

    const bucket = process.env.AUDIT_S3_BUCKET;
    if (!bucket) return res.status(500).json({ message: 'AUDIT_S3_BUCKET not configured' });

    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
    const endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;
    const clientOptions = { region };
    if (endpoint) {
      clientOptions.endpoint = endpoint;
      clientOptions.forcePathStyle = true;
    }
    const client = new S3Client(clientOptions);
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const expiresIn = parseInt(process.env.AUDIT_PRESIGN_EXPIRES || String(60 * 60), 10); // seconds

    const url = await getSignedUrl(client, cmd, { expiresIn });
    res.json({ url, expiresIn });
  } catch (err) {
    console.error('getAuditPresignedUrl', err);
    res.status(500).json({ message: 'Failed to generate presigned URL' });
  }
};


// List archived audit objects in S3 (admin only)
const listArchivedAudits = async (req, res) => {
  try {
    const bucket = process.env.AUDIT_S3_BUCKET;
    if (!bucket) return res.status(500).json({ message: 'AUDIT_S3_BUCKET not configured' });

    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
    const endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;
    const clientOptions = { region };
    if (endpoint) {
      clientOptions.endpoint = endpoint;
      clientOptions.forcePathStyle = true;
    }
    const client = new S3Client(clientOptions);

    const prefix = req.query.prefix || 'audits/';
    const maxKeys = Math.min(parseInt(req.query.limit || '100', 10), 1000);
    const continuationToken = req.query.continuationToken;

    const cmd = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: maxKeys, ContinuationToken: continuationToken });
    const resp = await client.send(cmd);

    const items = (resp.Contents || []).map((o) => ({ key: o.Key, size: o.Size, lastModified: o.LastModified }));
    res.json({ items, isTruncated: resp.IsTruncated, nextContinuationToken: resp.NextContinuationToken });
  } catch (err) {
    console.error('listArchivedAudits', err);
    res.status(500).json({ message: 'Failed to list archived audits' });
  }
};

module.exports = { exportAudit, archiveAuditsToS3, getAuditPresignedUrl, listArchivedAudits };
