const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const stream = require('stream');

const bucket = process.env.AUDIT_S3_BUCKET;
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const client = new S3Client({ region });

const uploadNdjsonStream = (key) => {
    const pass = new stream.PassThrough();

    const upload = new Upload({
        client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: pass,
            ContentType: 'application/x-ndjson'
        }
    });

    return {
        pass,
        uploadPromise: upload.done()
    };
};

module.exports = { uploadNdjsonStream };
