const request = require('supertest');
const jwt = require('jsonwebtoken');
const { createApp } = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// ensure JWT secret matches auth middleware default
process.env.JWT_SECRET = process.env.JWT_SECRET || 'SECRET123';

const Voter = require('../../models/voter');
const AuditLog = require('../../models/AuditLog');

describe('Admin audit export', () => {
  let app;
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({ instance: { dbName: 'test' } });
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  test('admin can export audits as NDJSON', async () => {
    const admin = await Voter.create({
      fullName: 'Admin', email: 'admin@test', phone: '0911999999', nationalId: 'ADM1', gender: 'male', region: 'R', dob: new Date('1980-01-01'), password: 'x', role: 'admin'
    });

    // create a couple of audit logs
    await AuditLog.create({ event: 'TEST1', actor: admin._id, meta: { a: 1 } });
    await AuditLog.create({ event: 'TEST2', actor: admin._id, meta: { b: 2 } });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'testsecret');

    const res = await request(app)
      .get('/api/admin/audit/export')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.headers['content-type']).toMatch(/ndjson/);
    // at least two lines
    const lines = res.text.trim().split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });
});
