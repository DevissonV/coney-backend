import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for payments.
 * @constant {Joi.ObjectSchema}
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
});

/**
 * Validates winner data against the schema.
 * @param {Object} data - Winner data to be validated.
 * @throws {Error} If validation fails.
 */
export const validatePaymentSession = (data) => {
  const { error, value } = paymentSessionSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
