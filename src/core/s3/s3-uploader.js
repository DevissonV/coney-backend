import s3 from './s3-client.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { envs } from '#core/config/envs.js';

/**
 * Uploads a public file to an S3 bucket.
 * @param {Buffer} fileBuffer - The buffer containing the file data to be uploaded.
 * @param {string} fileName - The name of the file, including its extension.
 * @param {string} folder - The folder path within the S3 bucket where the file will be stored.
 * @returns {Promise<string>} - A promise that resolves to the public URL of the uploaded file.
 *
 * @throws {Error} - Throws an error if the upload process fails.
 */
export const uploadPublicFile = async (fileBuffer, fileName, folder) => {
  const extension = fileName.split('.').pop();
  const key = `${folder}/${uuid()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: envs.S3_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: `image/${extension}`,
  });

  await s3.send(command);

  return `https://${envs.S3_BUCKET_NAME}.s3.${envs.S3_REGION}.amazonaws.com/${key}`;
};
