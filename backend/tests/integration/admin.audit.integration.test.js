const request = require('supertest');

// Mock auth/admin middleware to bypass JWT for tests
jest.mock('../../middleware/authMiddleware', () => () => (req, res, next) => next());
jest.mock('../../middleware/adminMiddleware', () => () => (req, res, next) => next());

// Mock S3 client and presigner
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: function () {
      return {
        send: jest.fn().mockResolvedValue({
          Contents: [
            { Key: 'audits/audit-1.ndjson', Size: 2048, LastModified: new Date() },
          ],
          IsTruncated: false,
          NextContinuationToken: null,
        }),
      };
    },
    ListObjectsV2Command: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(() => Promise.resolve('https://presigned.example/test')),
}));

// Ensure env var is set for controller
process.env.AUDIT_S3_BUCKET = 'test-bucket';

const { createApp } = require('../../app');

describe('Admin audit endpoints', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('GET /api/admin/audit/list returns items', async () => {
    const res = await request(app).get('/api/admin/audit/list?prefix=audits/&limit=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].key).toBe('audits/audit-1.ndjson');
  });

  test('GET /api/admin/audit/presign returns url', async () => {
    const res = await request(app).get('/api/admin/audit/presign?key=audits/audit-1.ndjson');
    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^https?:\/\//);
  });
});
