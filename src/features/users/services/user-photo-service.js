import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import userRepository from '../repositories/user-repository.js';
import { validateUserPhoto } from '../validations/user-photo-validation.js';
import dayjs from 'dayjs';

/**
 * Service class for handling user profile photo uploads.
 * This class delegates the file upload to an external upload module (via DI),
 * and is responsible for updating the user record with the image URL.
 *
 * @class UserPhotoService
 */
class UserPhotoService {
  /**
   * Creates an instance of UserPhotoService.
   * @param {Function} uploadFileFn - The function responsible for uploading the file to storage.
   */
  constructor(uploadFileFn) {
    this.uploadFileFn = uploadFileFn;
  }

  /**
   * Uploads a user's profile picture to S3 and updates the user's record with the file URL.
   *
   * @param {Buffer} buffer - The file content in binary.
   * @param {string} originalname - The original name of the uploaded file.
   * @param {number} userId - The ID of the user whose photo is being uploaded.
   * @returns {Promise<Object>} The result with the public photo URL.
   * @throws {AppError} If validation or upload fails.
   */
  async saveProfilePicture(buffer, originalname, userId) {
    try {
      validateUserPhoto({ userId });

      const photoUrl = await this.uploadFileFn({
        buffer,
        originalname,
        folder: `users`,
      });

      await userRepository.update(userId, {
        photo_url: photoUrl,
        updated_at: dayjs().toISOString(),
      });

      return { photoUrl };
    } catch (error) {
      getLogger().error(`Error upload photo users: ${error.message}`);
      throw new AppError(
        error.message || 'Could not save profile picture',
        error.statusCode || 500,
      );
    }
  }
}

export default UserPhotoService;
