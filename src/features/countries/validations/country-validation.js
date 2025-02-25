import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for country validation.
 */
const countrySchema = Joi.object({
  name: Joi.string().max(100).required(),
});

/**
 * Validates country data before processing.
 * @param {Object} data - Country data to validate.
 * @throws {AppError} If validation fails.
 */
export const validateCountry = (data) => {
  const { error, value } = countrySchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
