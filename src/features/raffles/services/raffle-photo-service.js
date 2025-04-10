import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import raffleRepository from '../repositories/raffle-repository.js';
import { validateRafflePhoto } from '../validations/raffle-photo-validation.js';
import dayjs from 'dayjs';

/**
 * Service class responsible for handling raffle photo uploads.
 * Delegates the actual upload logic to an injected function (e.g., AWS S3 uploader),
 * and updates the raffle record with the resulting URL.
 */
class RafflePhotoService {
  /**
   * Creates an instance of RafflePhotoService.
   * @param {Function} uploadFileFn - Function used to upload the file. Must return a public URL.
   */
  constructor(uploadFileFn) {
    this.uploadFileFn = uploadFileFn;
  }

  /**
   * Uploads a raffle image and updates the corresponding raffle record with the image URL.
   *
   * @param {Buffer} buffer - The binary content of the uploaded file.
   * @param {string} originalname - The original name of the uploaded file.
   * @param {number} raffleId - The ID of the raffle to update.
   * @returns {Promise<{ imageUrl: string }>} Resolves with the uploaded image's public URL.
   * @throws {AppError} If validation or upload fails.
   */
  async saveRaffleImage(buffer, originalname, raffleId) {
    try {
      validateRafflePhoto({ raffleId });

      const imageUrl = await this.uploadFileFn({
        buffer,
        originalname,
        folder: 'raffles',
      });

      await raffleRepository.update(raffleId, {
        photo_url: imageUrl,
        updated_at: dayjs().toISOString(),
      });

      return { imageUrl };
    } catch (error) {
      getLogger().error(`Error uploading raffle image: ${error.message}`);
      throw new AppError(
        error.message || 'Could not save raffle image',
        error.statusCode || 500,
      );
    }
  }
}

export default RafflePhotoService;
