import BaseController from '#core/base/base-controller.js';
import ticketService from '../services/ticket-service.js';
import ticketManagementService from '../services/ticket-management-service.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';

/**
 * Controller for managing tickets.
 * @class TicketController
 * @extends BaseController
 */
class TicketController extends BaseController {
  constructor() {
    super(ticketService, 'Ticket');
  }

  /**
   * Retrieves available tickets for a given raffle.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async getAvailables(req, res, next) {
    ticketManagementService
      .getAvailableTickets(req.query)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('GET_ALL', 'Available Tickets'),
        ),
      )
      .catch(next);
  }
}

export default new TicketController();
