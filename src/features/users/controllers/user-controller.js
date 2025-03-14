import BaseController from '#core/base/base-controller.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import userService from '../services/user-service.js';
import userSesionService from '../services/user-sesion-service.js';

/**
 * Controller for managing users.
 * @class UserController
 * @extends BaseController
 */
class UserController extends BaseController {
  constructor() {
    super(userService, 'User');
  }

  /**
   * Logs in a user and returns a token.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  async login(req, res, next) {
    userSesionService
      .login(req.body)
      .then((data) =>
        responseHandler.success(res, data, 'User logged in successfully'),
      )
      .catch(next);
  }
}

export default new UserController();
