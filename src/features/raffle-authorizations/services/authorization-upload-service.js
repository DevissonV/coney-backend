import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { validateAuthorizationUpload } from '../validations/authorization-document-validation.js';

/**
 * Service responsible for handling file uploads related to raffle authorization documents.
 * Delegates upload to a generic upload service.
 * @class AuthorizationUploadService
 */
class AuthorizationUploadService {
  /**
   * @param {Function} uploadFileFn - Upload function from uploads feature.
   */
  constructor(uploadFileFn) {
    this.uploadFileFn = uploadFileFn;
  }

  /**
   * Uploads a document for a raffle authorization and returns the S3 key.
   * @param {Object} params
   * @param {Buffer} params.buffer
   * @param {string} params.originalname
   * @param {number} params.raffleId
   * @param {string} params.type
   * @returns {Promise<string>} The S3 object key
   */
  async uploadDocument({ buffer, originalname, raffleId, type }) {
    try {
      validateAuthorizationUpload({ type, raffleId });

      const folder = `authorizations/raffle-${raffleId}/${type}`;

      const s3Key = await this.uploadFileFn({
        buffer,
        originalname,
        folder,
      });

      return s3Key;
    } catch (error) {
      getLogger().error(`Authorization upload error: ${error.message}`);
      throw new AppError('Could not upload authorization document', 500);
    }
  }
}

export default AuthorizationUploadService;
