import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import userService from '../services/user-service.js';

/**
 * Controller for managing users.
 * @class UserController
 */
class UserController {
  /**
   * Registers a new user.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  async register(req, res, next) {
    userService
      .register(req.body)
      .then((newUser) =>
        responseHandler.success(
          res,
          newUser,
          getSuccessMessage('CREATE', 'User'),
          201,
        ),
      )
      .catch(next);
  }

  /**
   * Logs in a user and returns a token.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  async login(req, res, next) {
    userService
      .login(req.body)
      .then((authData) =>
        responseHandler.success(res, authData, 'User logged in successfully'),
      )
      .catch(next);
  }

  /**
   * Deletes a user by username.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  async delete(req, res, next) {
    userService
      .deleteByUsername(req.body.username)
      .then(() =>
        responseHandler.success(res, {}, getSuccessMessage('DELETE', 'User')),
      )
      .catch(next);
  }
}

export default new UserController();
