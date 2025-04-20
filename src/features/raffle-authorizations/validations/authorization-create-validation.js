import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Joi schema for creating a new raffle authorization.
 * Ensures required fields are present and valid.
 */
const schema = Joi.object({
  raffleId: Joi.number().integer().positive().required().messages({
    'number.base': 'Raffle ID must be a number.',
    'number.integer': 'Raffle ID must be an integer.',
    'number.positive': 'Raffle ID must be positive.',
    'any.required': 'Raffle ID is required.',
  }),
  status: Joi.string()
    .valid('pending', 'reviewing', 'approved', 'rejected')
    .optional(),
  ticketText: Joi.string().max(1000).allow('', null).optional().messages({
    'string.base': 'Ticket text must be a string.',
    'string.max': 'Ticket text must not exceed 1000 characters.',
  }),
  createdBy: Joi.number().integer().positive().required().messages({
    'number.base': 'CreatedBy must be a number.',
    'number.positive': 'CreatedBy must be positive.',
    'any.required': 'CreatedBy is required.',
  }),
});

/**
 * Validates input data for creating a raffle authorization.
 *
 * @param {Object} data - Data to validate.
 * @returns {Object} Validated data.
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationCreate = (data) => {
  const { error, value } = schema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
