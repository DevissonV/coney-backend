import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating country search criteria.
 */
const countryCriteriaSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
});

/**
 * Validates country search criteria.
 * @param {Object} criteria - Query parameters.
 * @throws {AppError} If validation fails.
 */
export const validateCountryCriteria = (criteria) => {
  const { error, value } = countryCriteriaSchema.validate(criteria);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
