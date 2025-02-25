import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for raffle validation.
 * @constant {Joi.ObjectSchema}
 */
const raffleSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).allow(null, '').optional(),
  init_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref('init_date')).required(),
});

/**
 * Validates raffle data against the schema.
 * @param {Object} data - Raffle data to be validated.
 * @throws {AppError} If validation fails.
 */
export const validateRaffle = (data) => {
  const { error, value } = raffleSchema.validate(data);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
