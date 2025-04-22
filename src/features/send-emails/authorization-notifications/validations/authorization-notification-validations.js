import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema for validating the authorization and user data used in email notification.
 * Only required fields are validated; unknown fields are allowed.
 */
const schema = Joi.object({
  authorization: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required().messages({
      'any.only': 'Status must be either approved or rejected.',
      'any.required': 'Status is required.',
    }),
    raffle_name: Joi.string().required().messages({
      'string.base': 'Raffle name must be a string.',
      'any.required': 'Raffle name is required.',
    }),
  })
    .required()
    .unknown(true),

  user: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'User email must be valid.',
      'any.required': 'User email is required.',
    }),
    first_name: Joi.string().required().messages({
      'string.base': 'User first_name must be a string.',
      'any.required': 'User first_name is required.',
    }),
    last_name: Joi.string().required().messages({
      'string.base': 'User last_name must be a string.',
      'any.required': 'User last_name is required.',
    }),
  })
    .required()
    .unknown(true),
});

/**
 * Validates input data for sending authorization status change notification.
 *
 * @param {Object} authorization - Authorization object.
 * @param {Object} user - User object.
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationNotification = (authorization, user) => {
  const { error } = schema.validate({ authorization, user });
  if (error) throw new AppError(error.details[0].message, 400);
};
