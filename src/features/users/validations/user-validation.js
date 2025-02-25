import Joi from 'joi';
import { envs } from '#core/config/envs.js';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for user validation.
 */
const userSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required().messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.max': 'Username cannot exceed 50 characters.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.',
  }),

  role: Joi.string()
    .valid(envs.ROLE_ADMIN, envs.ROLE_USER, envs.ROLE_ANONYMOUS)
    .default(envs.ROLE_ANONYMOUS)
    .messages({
      'any.only': `Role must be either "${envs.ROLE_ADMIN}" or "${envs.ROLE_USER}" or "${envs.ROLE_ANONYMOUS}".`,
    }),
});

/**
 * Validates user data before processing.
 * @param {Object} userData - User data to validate.
 * @throws {AppError} If validation fails.
 */
export const validateUser = (userData) => {
  const { error, value } = userSchema.validate(userData, { abortEarly: false });

  if (error) {
    throw new AppError(error.details.map((err) => err.message).join(', '), 400);
  }

  return value;
};
