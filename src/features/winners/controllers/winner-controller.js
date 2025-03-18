import BaseController from '#core/base/base-controller.js';
import winnerService from '../services/winner-service.js';

/**
 * Controller for managing winners.
 * @class WinnerController
 * @extends BaseController
 */
class WinnerController extends BaseController {
  constructor() {
    super(winnerService, 'Winner');
  }
}

export default new WinnerController();
