import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for payment creation validation.
 */
const paymentUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed'),
});

/**
 * Validates payment data.
 */
export const validatePaymentUpdate = (data) => {
  const { error, value } = paymentUpdateSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
