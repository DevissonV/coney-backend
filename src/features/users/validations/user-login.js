import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating user login.
 * @constant {Joi.ObjectSchema}
 */
const userLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Validates the request user login using the defined schema.
 *
 * @param {Object} data - User data login
 * @returns {Object} The validated user data loging
 * @throws {AppError} Throws an AppError with a 400 status code if validation fails.
 */
export const validateUserLogin = (data) => {
  const { error, value } = userLogin.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
