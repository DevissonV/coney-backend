import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating raffle search criteria.
 * @constant {Joi.ObjectSchema}
 */
const raffleCriteriaSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  init_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  created_by: Joi.number().integer().min(1).optional(),
  updated_by: Joi.number().integer().min(1).optional(),
  is_active: Joi.boolean().optional(),
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
});

/**
 * Validates raffle search criteria using the defined schema.
 *
 * @param {Object} criteria - The search criteria object containing query parameters.
 * @returns {Object} The validated criteria.
 * @throws {AppError} Throws an AppError with a 400 status code if validation fails.
 */
export const validateRaffleCriteria = (criteria) => {
  const { error, value } = raffleCriteriaSchema.validate(criteria);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  return value;
};
