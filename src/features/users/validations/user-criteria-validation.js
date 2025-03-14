import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating user search criteria.
 * @constant {Joi.ObjectSchema}
 */
const userCriteriaSchema = Joi.object({
  email: Joi.string().email().optional(),
  id: Joi.number().integer().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  role: Joi.string().valid('admin', 'user', 'anonymous').optional(),
  is_email_validated: Joi.boolean().optional(),
  is_user_authorized: Joi.boolean().optional(),
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
});

/**
 * Validates the request search criteria using the defined schema.
 *
 * @param {Object} criteria - The search criteria object containing query parameters.
 * @returns {Object} The validated and possibly transformed criteria.
 * @throws {AppError} Throws an AppError with a 400 status code if validation fails.
 */
export const validateUserCriteria = (criteria) => {
  const { error, value } = userCriteriaSchema.validate(criteria);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
