import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import passwordRecoveryService from '../services/password-recovery-service.js';

/**
 * Controller for handling password recovery email logic.
 * Delegates all logic to the service layer.
 * @class PasswordRecoveryController
 */
class PasswordRecoveryController {
  /**
   * Handles the request to send a password recovery email.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async requestRecovery(req, res, next) {
    passwordRecoveryService
      .requestRecovery(req.body)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('CREATE', 'PasswordRecovery'),
          200,
        ),
      )
      .catch(next);
  }

  /**
   * Handles the request to reset the password using a valid token.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async resetPassword(req, res, next) {
    passwordRecoveryService
      .resetPassword(req.body)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('UPDATE', 'PasswordRecovery'),
          200,
        ),
      )
      .catch(next);
  }
}

export default new PasswordRecoveryController();
