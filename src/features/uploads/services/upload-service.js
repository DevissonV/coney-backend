import { uploadPublicFile } from '#core/s3/s3-uploader.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { validateUpload } from '../validations/upload-validation.js';
import { generateS3Key } from '../utils/uploader-helper.js';

/**
 * Uploads a file to an S3 bucket.
 * @param {Buffer} buffer - The file buffer to be uploaded.
 * @param {string} originalname - The original name of the file.
 * @param {string} folder - The folder in the S3 bucket where the file will be stored.
 * @returns {Promise<Object>} The result of the upload operation.
 * @throws {AppError} Throws an error if the upload fails.
 */
export const uploadFileToS3 = async ({ buffer, originalname, folder }) => {
  try {
    validateUpload({ buffer, originalname });

    const key = generateS3Key(originalname, folder);

    return await uploadPublicFile(buffer, key, folder);
  } catch (error) {
    getLogger().error(`Upload error: ${error.message}`);
    throw new AppError('Could not upload file', 500);
  }
};
