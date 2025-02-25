import 'dotenv/config';
import Joi from 'joi';

/**
 * Schema for environment variables validation and default values.
 * @constant {Object} envVarsSchema
 */
const envVarsSchema = Joi.object({
  APP_PORT: Joi.number().required().default(5000),
  DB_HOST: Joi.string().required().default('localhost'),
  DB_PORT: Joi.number().required().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .required()
    .default('development'),
  JWT_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_SECRET must be at least 16 characters',
    'any.required': 'JWT_SECRET is required',
  }),
  JWT_TIME_EXPIRES: Joi.string().required().messages({
    'any.required': 'JWT_TIME_EXPIRES is required',
  }),
  ROLE_ADMIN: Joi.string().required().messages({
    'any.required': 'ROLE_ADMIN is required',
  }),
  ROLE_USER: Joi.string().required().messages({
    'any.required': 'ROLE_USER is required',
  }),
  ROLE_ANONYMOUS: Joi.string().required().messages({
    'any.required': 'ROLE_ANONYMOUS is required',
  }),
  CORS_ORIGINS: Joi.string().required().messages({
    'any.required': 'CORS_ORIGINS is required',
  }),
  LOG_CLEANUP_SCHEDULE: Joi.string().required().default('0 0 * * 0').messages({
    'any.required': 'LOG_CLEANUP_SCHEDULE is required',
  }),
}).unknown(true);

/**
 * Validated environment variables.
 * @constant {Object} envs
 */
const { value, error } = envVarsSchema.validate(process.env, {
  abortEarly: false,
  stripUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs = value;
