import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from './s3-client.js';
import { envs } from '#core/config/envs.js';

/**
 * Generates a signed URL to access a private S3 object.
 * @param {string} key - S3 object key.
 * @param {number} [expiresInSeconds] - Expiration time in seconds. Defaults to env config.
 * @returns {Promise<string>} Pre-signed URL.
 */
export const generateSignedUrl = async (
  key,
  expiresInSeconds = envs.AWS_SIGNED_URL_EXPIRES,
) => {
  const command = new GetObjectCommand({
    Bucket: envs.S3_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
};
