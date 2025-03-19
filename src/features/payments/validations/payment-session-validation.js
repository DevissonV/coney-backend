import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for validating a payment session object.
 *
 * @typedef {Object} PaymentSession
 * @property {number} amount - The payment amount. Must be a positive number.
 * @property {number[]} tickets - An array of ticket IDs. Each ticket ID must be a positive integer. At least one ticket is required.
 * @property {number} raffleId - The ID of the raffle. Must be a positive integer.
 * @property {string} [currency='COP'] - The currency for the payment. Defaults to 'COP'.
 *
 */
const paymentSessionSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  tickets: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'Tickets must be an array',
      'array.min': 'At least one ticket is required',
      'any.required': 'Tickets are required',
    }),
  raffleId: Joi.number().integer().positive().required().messages({
    'number.base': 'Raffle ID must be a number',
    'number.positive': 'Raffle ID must be a positive number',
    'any.required': 'Raffle ID is required',
  }),
  currency: Joi.string().default('COP').messages({
    'string.base': 'Currency must be a string',
  }),
});

/**
 * Validates the payment session data against the defined schema.
 *
 * @param {Object} data - The payment session data to validate.
 * @throws {AppError} Throws an error with a message and status code 400 if validation fails.
 * @returns {Object} The validated payment session data.
 */
export const validatePaymentSession = (data) => {
  const { error, value } = paymentSessionSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
