import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for updating a raffle.
 * `ticketCount` is removed because it should not be updated.
 */
const updateRaffleSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(255).allow(null, '').optional(),
  initDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref('initDate')).optional(),
  price: Joi.number().positive().optional(), // ✅ Se puede actualizar
});

/**
 * Validates raffle data for updating.
 * @param {Object} data - Raffle data to validate.
 * @throws {AppError} If validation fails.
 */
export const validateRaffleUpdate = (data) => {
  const { error, value } = updateRaffleSchema.validate(data);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
