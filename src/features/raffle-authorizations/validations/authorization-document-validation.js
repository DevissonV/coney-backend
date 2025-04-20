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
const uploadSchema = Joi.object({
  type: Joi.string()
    .valid(...ALLOWED_DOCUMENT_TYPES)
    .required()
    .messages({
      'any.only': 'Invalid document type.',
      'any.required': 'Document type is required.',
    }),
  raffleId: Joi.number().integer().positive().required().messages({
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
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationUpload = (data) => {
  const { error } = uploadSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
};

/**
 * Joi schema for validating DB document creation.
 */
const createSchema = Joi.object({
  authorizationId: Joi.number().integer().positive().required().messages({
    'number.base': 'Authorization ID must be a number.',
    'number.integer': 'Authorization ID must be an integer.',
    'number.positive': 'Authorization ID must be positive.',
    'any.required': 'Authorization ID is required.',
  }),
  type: Joi.string()
    .valid(...ALLOWED_DOCUMENT_TYPES)
    .required()
    .messages({
      'any.only': 'Invalid document type.',
      'any.required': 'Document type is required.',
    }),
  fileUrl: Joi.string().min(5).required().messages({
    'string.base': 'File URL must be a string.',
    'string.empty': 'File URL cannot be empty.',
    'any.required': 'File URL is required.',
  }),
});

/**
 * Validates the input for creating a document record in DB.
 *
 * @param {Object} data - The data to validate.
 * @returns {Object} validated data
 * @throws {AppError} If validation fails.
 */
export const validateAuthorizationDocumentCreate = (data) => {
  const { error, value } = createSchema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};
