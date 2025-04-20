import { uploadPrivateFile } from '#core/s3/s3-uploader.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { validateAuthorizationUpload } from '../validations/authorization-document-validation.js';
import { generateS3Key } from '../../uploads/utils/uploader-helper.js';

/**
 * Service responsible for handling file uploads related to raffle authorization documents.
 * This service validates the file and uploads it to S3 privately.
 * @class AuthorizationUploadService
 */
class AuthorizationUploadService {
  /**
   * Uploads a private document file to S3 and returns the S3 key.
   *
   * @param {Object} params - The upload parameters.
   * @param {Buffer} params.buffer - The file buffer to be uploaded.
   * @param {string} params.originalname - The original name of the file.
   * @param {number} params.raffleId - The ID of the raffle associated with the document.
   * @param {string} params.type - The document type (e.g., 'cedula', 'rut').
   * @returns {Promise<string>} The S3 object key (not signed URL).
   * @throws {AppError} If validation or upload fails.
   */
  async uploadDocument({ buffer, originalname, raffleId, type }) {
    try {
      validateAuthorizationUpload({ buffer, originalname, type, raffleId });

      const folder = `authorizations/raffle-${raffleId}/${type}`;
      const key = generateS3Key(originalname, folder);

      await uploadPrivateFile(buffer, key);

      return key;
    } catch (error) {
      getLogger().error(`Authorization upload error: ${error.message}`);
      throw new AppError('Could not upload authorization document', 500);
    }
  }
}

export default new AuthorizationUploadService();
