import BaseController from '#core/base/base-controller.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import { raffleService } from '../services/raffle-dependencies.js';
import { rafflePhotoService } from '../services/raffle-dependencies.js';

/**
 * Controller for managing raffles.
 * @class RaffleController
 * @extends BaseController
 */
class RaffleController extends BaseController {
  constructor() {
    super(raffleService, 'Raffles');
  }

  /**
   * Handles the upload of a raffle photo.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<void>} Resolves when the operation is complete.
   */
  async uploadPhoto(req, res, next) {
    rafflePhotoService
      .saveRaffleImage(req.file.buffer, req.file.originalname, req.params.id)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('UPDATE', 'Raffle Image'),
        ),
      )
      .catch(next);
  }
}

export default new RaffleController();
