import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

const schema = Joi.object({
  raffle_id: Joi.number().integer().positive().optional(),
  status: Joi.string()
    .valid('pending', 'reviewing', 'approved', 'rejected')
    .optional(),
  created_by: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
});

export const validateAuthorizationCriteria = (params) => {
  const { error, value } = schema.validate(params);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
