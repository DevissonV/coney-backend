import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating payment search criteria.
 * @constant {Joi.ObjectSchema}
 */
const paymentCriteriaSchema = Joi.object({
  raffle_id: Joi.number().integer().positive().optional(),
  stripe_session_id: Joi.string().optional(),
  status: Joi.string().valid('pending', 'completed', 'failed').optional(),
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
export const validatePaymentCriteria = (criteria) => {
  const { error, value } = paymentCriteriaSchema.validate(criteria);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
