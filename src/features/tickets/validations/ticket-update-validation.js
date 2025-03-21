import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for ticket validation.
 * @constant {Joi.ObjectSchema}
 */
const ticketUpdateSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

/**
 * Validates ticket data against the schema.
 * @param {Object} ticketData - ticket data to be validated.
 * @throws {Error} If validation fails.
 */
export const validateTicketUpdate = (data) => {
  const { error } = ticketUpdateSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
