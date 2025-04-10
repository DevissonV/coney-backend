import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { uploadFileToS3 } from '../../uploads/services/upload-service.js';
import userRepository from '../repositories/user-repository.js';
import { validateUserPhoto } from '../validations/user-photo-validation.js';
import dayjs from 'dayjs';

export const saveUserProfilePicture = async (buffer, originalname, userId) => {
  try {
    validateUserPhoto({ userId });

    const photoUrl = await uploadFileToS3({
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
};
