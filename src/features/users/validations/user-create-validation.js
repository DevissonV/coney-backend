import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';
import { envs } from '#core/config/envs.js';

/**
 * Schema definition for user validation.
 * @constant {Joi.ObjectSchema}
 */
const userSchema = Joi.object({
  email: Joi.string().trim().email().max(50).required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Invalid email format.',
    'string.max': 'Email cannot exceed 50 characters.',
  }),

  firstName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'First name is required.',
    'string.max': 'First name cannot exceed 100 characters.',
  }),

  lastName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Last name is required.',
    'string.max': 'Last name cannot exceed 100 characters.',
  }),

  password: Joi.string().min(6).max(255).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.',
    'string.max': 'Password cannot exceed 255 characters.',
  }),

  isEmailValidated: Joi.boolean().default(false),
  isUserAuthorized: Joi.boolean().default(false),

  role: Joi.string()
    .valid(envs.ROLE_ADMIN, envs.ROLE_USER, envs.ROLE_ANONYMOUS)
    .default(envs.ROLE_ANONYMOUS)
    .messages({
      'any.only': `Role must be either "${envs.ROLE_ADMIN}", "${envs.ROLE_USER}" or "${envs.ROLE_ANONYMOUS}".`,
    }),
});

/**
 * Validates user data against the schema.
 * @param {Object} userData - user data to be validated.
 * @throws {Error} If validation fails.
 */
export const validateUserCreate = (data) => {
  const { error } = userSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
