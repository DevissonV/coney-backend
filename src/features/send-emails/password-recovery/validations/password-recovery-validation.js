import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema for validating password recovery request (email only).
 */
const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
});

/**
 * Validates the password recovery request body.
 * @param {Object} data - Incoming request body.
 * @returns {Object} The validated data.
 * @throws {AppError} If validation fails.
 */
export const validatePasswordRecovery = (data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
