import { S3Client } from '@aws-sdk/client-s3';
import { envs } from '#core/config/envs.js';

/**
 * Initializes an S3 client instance with the specified configuration.
 *
 * @type {S3Client}
 * @property {string} region - The AWS region where the S3 bucket is located.
 * @property {Object} credentials - The credentials used to authenticate with AWS.
 * @property {string} credentials.accessKeyId - The AWS access key ID.
 * @property {string} credentials.secretAccessKey - The AWS secret access key.
 */
const s3 = new S3Client({
  region: envs.S3_REGION,
  credentials: {
    accessKeyId: envs.S3_ACCESS_KEY_ID,
    secretAccessKey: envs.S3_SECRET_ACCESS_KEY,
  },
});

export default s3;
