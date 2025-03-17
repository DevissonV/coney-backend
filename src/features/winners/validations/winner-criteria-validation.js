import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating winner search criteria.
 * Allows filtering by raffle_id, ticket_id and user_id.
 * @constant {Joi.ObjectSchema}
 */
const winnerCriteriaSchema = Joi.object({
  raffle_id: Joi.number().integer().optional(),
  ticket_id: Joi.number().integer().optional(),
  user_id: Joi.number().integer().optional(),
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
export const validateWinnerCriteria = (criteria) => {
  const { error, value } = winnerCriteriaSchema.validate(criteria);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
