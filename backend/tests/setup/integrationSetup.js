const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  // start in-memory mongo
  mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'test' } });
  const uri = mongoServer.getUri();

  // connect mongoose
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // expose stop hook for afterAll via global
  global.__MONGOSERVER__ = mongoServer;

  // set test-friendly env
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  process.env.EMAIL_USER = process.env.EMAIL_USER || 'noreply@example.test';
  process.env.EMAIL_PASS = process.env.EMAIL_PASS || 'dummy';

  // jest hooks
  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (global.__MONGOSERVER__) {
      await global.__MONGOSERVER__.stop();
    }
  });
};
