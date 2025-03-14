import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';
import { envs } from '#core/config/envs.js';

/**
 * Schema definition for user update validation.
 * This schema allows updating only specific fields and makes `password` optional.
 * @constant {Joi.ObjectSchema}
 */
const userUpdateSchema = Joi.object({
  firstName: Joi.string().trim().max(100).optional(),

  lastName: Joi.string().trim().max(100).optional(),

  password: Joi.string().min(6).max(255).optional(),

  role: Joi.string()
    .valid(envs.ROLE_ADMIN, envs.ROLE_USER, envs.ROLE_ANONYMOUS)
    .optional(),

  isEmailValidated: Joi.boolean().optional(),
  isUserAuthorized: Joi.boolean().optional(),
});

/**
 * Validates user update data.
 * @param {Object} data - User update data to validate.
 * @throws {AppError} If validation fails.
 */
export const validateUserUpdate = (data) => {
  const { error } = userUpdateSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
