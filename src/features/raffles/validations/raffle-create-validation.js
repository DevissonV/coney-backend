import Joi from 'joi';
import dayjs from 'dayjs';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Get the current date in ISO format.
 */
const now = dayjs().toISOString();

/**
 * Schema for creating a new raffle.
 * Ensures `initDate` is in the future and `endDate` is after `initDate`.
 */
const createRaffleSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).allow(null, '').optional(),
  initDate: Joi.date().iso().required(),
  endDate: Joi.date()
    .iso()
    .min(now)
    .greater(Joi.ref('initDate'))
    .required()
    .messages({
      'date.greater': 'endDate must be greater than initDate',
    }),
  price: Joi.number().positive().required(),
  ticketCount: Joi.number().integer().min(10).required(),
  createdBy: Joi.number().integer().positive().required(),
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
