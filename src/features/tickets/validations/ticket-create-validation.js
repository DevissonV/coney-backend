import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for ticket validation.
 * @constant {Joi.ObjectSchema}
 */
const ticketSchema = Joi.object({
  ticketNumber: Joi.number().required(),
  raffleId: Joi.number().integer().allow(null),
  userId: Joi.number().integer().allow(null),
});

/**
 * Validates ticket data against the schema.
 * @param {Object} ticketData - ticket data to be validated.
 * @throws {Error} If validation fails.
 */
export const validateTicketCreate = (data) => {
  const { error } = ticketSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};
