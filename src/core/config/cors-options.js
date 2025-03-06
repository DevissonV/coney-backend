import { envs } from './envs.js';

/**
 * CORS configuration options.
 * @constant {Object} corsOptions
 * @property {string[]} origin - Allowed origins for CORS requests, parsed from environment variables.
 * @property {boolean} credentials - Indicates whether credentials (cookies, authorization headers) are allowed.
 * @property {number} optionsSuccessStatus - Status code to send for successful preflight requests.
 */
export const corsOptions = {
  origin: envs.CORS_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
