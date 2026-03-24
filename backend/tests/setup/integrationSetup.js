const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // start in-memory mongo
  mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'test' } });
  const uri = mongoServer.getUri();

  // connect mongoose
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // set test-friendly env
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  process.env.EMAIL_USER = process.env.EMAIL_USER || 'noreply@example.test';
  process.env.EMAIL_PASS = process.env.EMAIL_PASS || 'dummy';
});

// jest hooks
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
