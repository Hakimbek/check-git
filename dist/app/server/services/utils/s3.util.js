const { wkVars } = require('./vars.util');

const env = wkVars.vars('env');
const isProdEnv = env === 'prod' || env === 'prod-ohio';

const s3AxcessBucketName = isProdEnv ? 'ac-axcess-prod' : 'ac-axcess-non-prod';
const localS3CAxcessBucketCredentials = isProdEnv
    ? process.env.S3_AXCESS_PROD_CREDS && JSON.parse(process.env.S3_AXCESS_PROD_CREDS)
    : process.env.S3_AXCESS_NON_PROD_CREDS && JSON.parse(process.env.S3_AXCESS_NON_PROD_CREDS);
const remoteS3AxcessBucketCredentials = {
    accessKeyId: process.env.AWS_AXCESS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_AXCESS_BUCKET_SECRET_KEY,
};

const s3AxcessBucketCredentials =
    remoteS3AxcessBucketCredentials.accessKeyId && remoteS3AxcessBucketCredentials.secretAccessKey
        ? remoteS3AxcessBucketCredentials
        : localS3CAxcessBucketCredentials;

const s3BucketConfigs = [
    {
        bucketName: s3AxcessBucketName,
        credentials: s3AxcessBucketCredentials,
    },
];

module.exports = {
    s3BucketsRegion: 'us-east-1',
    s3BucketConfigs,
    s3AxcessBucketName,
};
