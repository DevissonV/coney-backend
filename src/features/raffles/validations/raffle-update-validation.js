import Joi from 'joi';
import dayjs from 'dayjs';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Get the current date in ISO format.
 */
const now = dayjs().toISOString();

/**
 * Schema for updating a raffle.
 * Ensures `initDate` is in the future and `endDate` is after `initDate` if provided.
 */
const updateRaffleSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(255).allow(null, '').optional(),
  initDate: Joi.date().iso().min(now).optional().messages({
    'date.min': 'initDate must be today or in the future',
  }),
  endDate: Joi.date().iso().greater(Joi.ref('initDate')).optional().messages({
    'date.greater': 'endDate must be greater than initDate',
  }),
  price: Joi.number().positive().optional(),
  isActive: Joi.boolean().optional(),
  updatedBy: Joi.number().integer().positive().required(),
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
