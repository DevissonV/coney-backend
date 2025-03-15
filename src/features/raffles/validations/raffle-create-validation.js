import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema for creating a new raffle.
 * `ticketCount` is required because we need to generate the tickets.
 */
const createRaffleSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).allow(null, '').optional(),
  initDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('initDate')).required(),
  price: Joi.number().positive().required(), // ✅ Requerido
  ticketCount: Joi.number().integer().min(1).required(), // ✅ Requerido SOLO en creación
});

/**
 * Validates raffle data for creation.
 * @param {Object} data - Raffle data to validate.
 * @throws {AppError} If validation fails.
 */
export const validateRaffleCreate = (data) => {
  const { error, value } = createRaffleSchema.validate(data);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
