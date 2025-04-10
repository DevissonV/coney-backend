import { uploadPublicFile } from '#core/s3/s3-uploader.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import userRepository from '../repositories/user-repository.js';
import { validateUserPhoto } from '../validations/user-photo-validation.js';

/**
 * Saves a user's profile picture by validating the photo, uploading it to a public storage,
 * and updating the user's record in the repository with the photo URL.
 * @param {Buffer} fileBuffer - The buffer containing the file data of the profile picture.
 * @param {string} originalName - The original name of the uploaded file.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<{photoUrl: string}>} An object containing the URL of the uploaded profile picture.
 * @throws {AppError} Throws an error if the profile picture could not be saved.
 */
export const saveUserProfilePicture = async (
  fileBuffer,
  originalName,
  userId,
) => {
  try {
    validateUserPhoto({
      userId,
      originalName,
      buffer: fileBuffer,
    });

    const photoUrl = await uploadPublicFile(
      fileBuffer,
      originalName,
      `users/${userId}`,
    );

    await userRepository.update(userId, {
      photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    });

    return { photoUrl };
  } catch (error) {
    getLogger().error(`Error saving photo: ${error.message}`);
    throw new AppError('Could not save profile picture', 500);
  }
};
