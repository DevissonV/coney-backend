import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema for updating a raffle authorization.
 * Allows partial updates, including status and ticket text.
 */
const schema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewing', 'approved', 'rejected')
    .optional(),
  ticketText: Joi.string().max(1000).allow('', null).optional().messages({
    'string.base': 'Ticket text must be a string.',
    'string.max': 'Ticket text must not exceed 1000 characters.',
  }),
  rejectionReason: Joi.string().max(1000).allow('', null).optional().messages({
    'string.base': 'Rejection reason must be a string.',
    'string.max': 'Rejection reason must not exceed 1000 characters.',
  }),
});

/**
 * Validates input data for updating a raffle authorization.
 *
 * @param {Object} data - Data to validate.
 * @returns {Object} Validated data.
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationUpdate = (data) => {
  const { error, value } = schema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
