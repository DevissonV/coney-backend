import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

const schema = Joi.object({
  originalname: Joi.string()
    .pattern(/\.(jpg|jpeg|png|webp)$/i)
    .required()
    .messages({
      'string.pattern.base':
        'Invalid image format. Only .jpg, .jpeg, .png, and .webp are allowed.',
      'any.required': 'Image filename is required.',
    }),
  buffer: Joi.binary()
    .min(100)
    .max(5 * 1024 * 1024)
    .required()
    .messages({
      'binary.base': 'Image must be a binary file.',
      'binary.min': 'Image file is too small.',
      'binary.max': 'Image must not exceed 5MB.',
      'any.required': 'Image file is required.',
    }),
});

export const validateUpload = (data) => {
  const { error } = schema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
};
