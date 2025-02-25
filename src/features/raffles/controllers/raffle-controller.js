import BaseController from '#core/base/base-controller.js';
import raffleService from '../services/raffle-service.js';

/**
 * Controller for managing raffles.
 * @class RaffleController
 * @extends BaseController
 */
class RaffleController extends BaseController {
  constructor() {
    super(raffleService, 'Raffles');
  }
}

export default new RaffleController();