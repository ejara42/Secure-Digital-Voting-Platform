const request = require('supertest');
const jwt = require('jsonwebtoken');
const { createApp } = require('../../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// ensure JWT secret matches auth middleware default
process.env.JWT_SECRET = process.env.JWT_SECRET || 'SECRET123';

// mock email to avoid real SMTP during tests
jest.mock('../../utils/email', () => ({ sendEmail: jest.fn().mockResolvedValue(true) }));

const Voter = require('../../models/Voter');
const Ballot = require('../../models/Ballot');
const Candidate = require('../../models/Candidate');
const Otp = require('../../models/Otp');
const Vote = require('../../models/Vote');
const AuditLog = require('../../models/AuditLog');

describe('Integration: Vote flow', () => {
  let app;
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({ instance: { dbName: 'test' } });
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app = createApp({ io: { to: () => ({ emit: () => { } }), emit: () => { } } });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  test('send OTP, submit vote, prevent duplicate and record audits', async () => {
    // create voter
    const voter = await Voter.create({
      fullName: 'Test Voter',
      email: 'voter@test.local',
      phone: '0911000000',
      nationalId: 'ID123456',
      gender: 'male',
      region: 'TestRegion',
      dob: new Date('1990-01-01'),
      password: 'hashedpwd'
    });

    // create ballot and candidate
    const ballot = await Ballot.create({ title: 'General', election: 'gen-2025' });
    const candidate = await Candidate.create({ name: 'Alice', party: 'Demo', election: ballot.election });

    const token = jwt.sign({ id: voter._id }, process.env.JWT_SECRET || 'testsecret');

    // send OTP
    const otpResp = await request(app)
      .post('/api/votes/otp')
      .set('Authorization', `Bearer ${token}`)
      .send({ electionId: ballot._id.toString() })
      .expect(200);

    expect(otpResp.body.message).toMatch(/OTP sent/);

    // OTP should be persisted (match by voter; electionId may be stored as string)
    const otpRecord = await Otp.findOne({ voterId: voter._id });
    expect(otpRecord).toBeTruthy();
    expect(String(otpRecord.electionId)).toEqual(String(ballot._id));

    // submit vote
    const submitResp = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({ electionId: ballot._id.toString(), candidateId: candidate._id.toString(), otp: otpRecord.otp })
      .expect(200);

    expect(submitResp.body.receipt).toBeTruthy();

    // trying to vote again with the same (now-deleted) OTP should fail with invalid/expired OTP
    await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({ electionId: ballot._id.toString(), candidateId: candidate._id.toString(), otp: otpRecord.otp })
      .expect(400);

    // audit logs should contain OTP_SENT and VOTE_CAST and an invalid-otp event for the second attempt
    const sent = await AuditLog.findOne({ event: 'OTP_SENT', actor: voter._id });
    const cast = await AuditLog.findOne({ event: 'VOTE_CAST', actor: voter._id });
    const invalid = await AuditLog.findOne({ event: 'VOTE_INVALID_OTP', actor: voter._id });

    expect(sent).toBeTruthy();
    expect(cast).toBeTruthy();
    expect(invalid).toBeTruthy();
  });
});
