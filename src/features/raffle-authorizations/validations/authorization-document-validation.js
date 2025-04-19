import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Valid types of documents accepted for authorization.
 * @type {string[]}
 */
export const ALLOWED_DOCUMENT_TYPES = [
    'identification_document',
    'tax_certificate',
    'prize_invoice',
    'prize_appraisal',
    'compliance_insurance',
    'organizer_certificate',
    'schedule',
    'ticket_text',
  ];

/**
 * Joi schema for validating uploaded authorization documents.
 * Ensures file type, buffer, and raffle ID are valid.
 */
const schema = Joi.object({
  originalname: Joi.string()
    .pattern(/\.(pdf|jpg|jpeg|png)$/i)
    .required()
    .messages({
      'string.pattern.base':
        'Invalid file format. Only .pdf, .jpg, .jpeg, and .png are allowed.',
      'any.required': 'Filename is required.',
    }),
  buffer: Joi.binary()
    .min(100)
    .max(5 * 1024 * 1024)
    .required()
    .messages({
      'binary.base': 'File must be binary.',
      'binary.min': 'File is too small.',
      'binary.max': 'File exceeds maximum size (5MB).',
      'any.required': 'File buffer is required.',
    }),
  type: Joi.string()
    .valid(...ALLOWED_DOCUMENT_TYPES)
    .required()
    .messages({
      'any.only': 'Invalid document type.',
      'any.required': 'Document type is required.',
    }),
  raffleId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Raffle ID must be a number.',
      'number.integer': 'Raffle ID must be an integer.',
      'number.positive': 'Raffle ID must be positive.',
      'any.required': 'Raffle ID is required.',
    }),
});

/**
 * Validates the uploaded document for a raffle authorization.
 *
 * @param {Object} data - The data to validate.
 * @param {string} data.originalname - The file's original name.
 * @param {Buffer} data.buffer - The file buffer.
 * @param {string} data.type - Type of the document.
 * @param {number} data.raffleId - Associated raffle ID.
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationUpload = (data) => {
  const { error } = schema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
};
