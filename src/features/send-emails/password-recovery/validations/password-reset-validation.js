import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema for validating the password reset request.
 */
const schema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'Password must be at least 8 characters long',
  }),
});

/**
 * Validates the password reset request body.
 * @param {Object} data - Incoming request body.
 * @returns {Object} The validated data.
 * @throws {AppError} If validation fails.
 */
export const validatePasswordResetRequest = (data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
