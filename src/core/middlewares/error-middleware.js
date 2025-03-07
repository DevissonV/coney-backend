import { responseHandler } from '../utils/response/response-handler.js';
import { getLogger } from '../utils/logger/logger.js';

/**
 * Middleware for handling errors globally.
 * Logs errors and sends a standardized response.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const errorMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  getLogger().error(
    `Error: ${err.message} | Status: ${statusCode} | Path: ${req.originalUrl}`,
  );

  return responseHandler.error(res, err.message, statusCode);
};

export default errorMiddleware;
