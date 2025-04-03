import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for winner validation.
 * Since winner creation is automatic, we only require the raffle_id.
 * @constant {Joi.ObjectSchema}
 */
const winnerSchema = Joi.object({
  raffle_id: Joi.number().integer().required(),
  createdBy: Joi.number().integer().required(),
});

/**
 * Validates winner data against the schema.
 * @param {Object} data - Winner data to be validated.
 * @throws {Error} If validation fails.
 */
export const validateWinner = (data) => {
  const { error } = winnerSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
