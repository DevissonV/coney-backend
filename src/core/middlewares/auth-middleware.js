import jwt from 'jsonwebtoken';
import { envs } from '../config/envs.js';

/**
 * Middleware to authenticate requests using JWT.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 * @returns {void} Calls next middleware if authentication is successful.
 */
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      error: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, envs.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ status: false, code: 401, error: 'Invalid token.' });
  }
};

/**
 * Middleware to authorize users based on roles.
 * @param {string[]} roles - List of allowed roles.
 * @returns {Function} Express middleware function.
 */
export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: false,
      code: 403,
      error: 'Access forbidden. Insufficient permissions.',
    });
  }
  next();
};
