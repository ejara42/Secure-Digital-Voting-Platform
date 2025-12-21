const fetch = require('node-fetch');
const { S3Client, CreateBucketCommand } = require('@aws-sdk/client-s3');
const { spawn } = require('child_process');

const AWS_ENDPOINT = process.env.AWS_ENDPOINT || 'http://localhost:4566';
const BUCKET = process.env.AUDIT_S3_BUCKET || 'test-audit-bucket';

async function waitForLocalStack() {
  const healthUrl = `${AWS_ENDPOINT}/health`;
  const max = 60;
  for (let i = 0; i < max; i++) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) return;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('LocalStack did not become healthy in time');
}

async function createBucket() {
  const client = new S3Client({ region: 'us-east-1', endpoint: AWS_ENDPOINT, forcePathStyle: true });
  try {
    await client.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log('Created bucket', BUCKET);
  } catch (err) {
    if (err && err.name === 'BucketAlreadyOwnedByYou') {
      console.log('Bucket already exists');
    } else {
      console.warn('Create bucket warning:', err && err.message ? err.message : err);
    }
  }
}

async function runTests() {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env, {
      AWS_ENDPOINT: AWS_ENDPOINT,
      AUDIT_S3_BUCKET: BUCKET,
      AWS_ACCESS_KEY_ID: 'test',
      AWS_SECRET_ACCESS_KEY: 'test',
      AWS_DEFAULT_REGION: 'us-east-1',
      NODE_ENV: 'test',
    });

    const cmd = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['test', '--silent'], { stdio: 'inherit', env });
    cmd.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Tests failed with code ' + code));
    });
  });
}

(async () => {
  try {
    console.log('Waiting for LocalStack...');
    await waitForLocalStack();
    console.log('LocalStack is healthy, creating bucket...');
    await createBucket();
    console.log('Running backend tests...');
    await runTests();
    console.log('Tests passed');
    process.exit(0);
  } catch (err) {
    console.error('localstack-test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
