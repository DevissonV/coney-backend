import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for payment creation validation.
 */
const paymentCreateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('COP'),
  raffleId: Joi.number().integer().positive().required(),
  tickets: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  stripeSessionId: Joi.string().optional(),
  status: Joi.string()
    .valid('pending', 'completed', 'failed')
    .default('pending'),
});

/**
 * Validates payment data.
 */
export const validatePaymentCreate = (data) => {
  const { error, value } = paymentCreateSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
