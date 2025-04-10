import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema to validate the raffle photo upload request.
 * Ensures that the raffleId is a required positive integer.
 */
const rafflePhotoSchema = Joi.object({
  raffleId: Joi.number().integer().positive().required().messages({
    'number.base': 'Raffle ID must be a number.',
    'number.integer': 'Raffle ID must be an integer.',
    'number.positive': 'Raffle ID must be greater than zero.',
    'any.required': 'Raffle ID is required.',
  }),
});

/**
 * Validates the data for uploading a raffle photo.
 *
 * @param {Object} data - The data object containing the raffleId.
 * @param {number} data.raffleId - The ID of the raffle being validated.
 * @throws {AppError} Throws an error with a custom message if validation fails.
 */
export const validateRafflePhoto = (data) => {
  const { error } = rafflePhotoSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
};
