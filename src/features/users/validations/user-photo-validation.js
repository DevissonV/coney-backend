import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for user photo upload validation.
 * Validates the user ID and the file (name, format, size).
 */
const userPhotoSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number.',
    'number.integer': 'User ID must be an integer.',
    'number.positive': 'User ID must be greater than zero.',
    'any.required': 'User ID is required.',
  }),

  originalName: Joi.string()
    .pattern(/\.(jpg|jpeg|png|webp)$/i)
    .required()
    .messages({
      'string.pattern.base':
        'Invalid image format. Only .jpg, .jpeg, .png, and .webp are allowed.',
      'any.required': 'Image filename is required.',
    }),

  buffer: Joi.binary()
    .min(100)
    .max(5 * 1024 * 1024)
    .required()
    .messages({
      'binary.base': 'Image must be a binary file.',
      'binary.min': 'Image file is too small.',
      'binary.max': 'Image must not exceed 5MB.',
      'any.required': 'Image file is required.',
    }),
});

/**
 * Validates user ID and file for photo upload.
 * @param {Object} data - { userId, originalname, buffer }
 * @throws {AppError} If validation fails.
 */
export const validateUserPhoto = (data) => {
  const { error } = userPhotoSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
