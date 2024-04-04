const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { s3BucketsRegion, s3BucketConfigs } = require('./utils/s3.util');

class S3ClientService {
    constructor() {
        this._s3Clients = {};

        s3BucketConfigs.forEach(config => {
            this._s3Clients[config.bucketName] = new S3Client({
                region: s3BucketsRegion,
                credentials: config.credentials,
            });
        });
    }

    async getObjectBody(objectKey, bucketName) {
        const s3Client = this._s3Clients[bucketName];
        const getObjectCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });

        const data = await s3Client.send(getObjectCommand);
        const bodyAsString = await data.Body.transformToString();

        return bodyAsString;
    }
}

module.exports = new S3ClientService();
