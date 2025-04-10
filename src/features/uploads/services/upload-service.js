import { uploadPublicFile } from '#core/s3/s3-uploader.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { validateUpload } from '../validations/upload-validation.js';
import { generateS3Key } from '../utils/uploader-helper.js';

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
