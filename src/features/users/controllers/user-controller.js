import BaseController from '#core/base/base-controller.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import userService from '../services/user-service.js';
import userSesionService from '../services/user-sesion-service.js';
import { userPhotoService } from '../services/user-dependencies.js';

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

  /**
   * Handles the upload of a user's profile photo.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function in the stack.
   * @returns {Promise<void>} Resolves when the photo is successfully uploaded and a response is sent.
   * @throws {Error} Passes any errors to the next middleware.
   */
  async uploadPhoto(req, res, next) {
    userPhotoService
      .saveProfilePicture(req.file.buffer, req.file.originalname, req.params.id)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('UPDATE', 'User Photo'),
        ),
      )
      .catch(next);
  }
}

export default new UserController();
