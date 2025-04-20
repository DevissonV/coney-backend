import { uploadPrivateFile } from '#core/s3/s3-uploader.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { validateUpload } from '../validations/upload-validation.js';
import { generateS3Key } from '../utils/uploader-helper.js';

/**
 * Uploads a file to a private S3 bucket location and returns only the key (not the URL).
 *
 * @param {Object} params - Upload parameters.
 * @param {Buffer} params.buffer - The file data.
 * @param {string} params.originalname - The original name of the file.
 * @param {string} params.folder - S3 folder path.
 * @returns {Promise<string>} The generated S3 object key.
 * @throws {AppError} If validation or upload fails.
 */
export const uploadPrivateFileToS3 = async ({
  buffer,
  originalname,
  folder,
}) => {
  try {
    validateUpload({ buffer, originalname });

    const key = generateS3Key(originalname, folder);

    await uploadPrivateFile(buffer, key);

    return key;
  } catch (error) {
    getLogger().error(`Private upload error: ${error.message}`);
    throw new AppError('Could not upload file privately', 500);
  }
};
