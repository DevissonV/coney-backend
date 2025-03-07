import BaseController from '#core/base/base-controller.js';
import ticketService from '../services/ticket-service.js';

/**
 * Controller for managing tickets.
 * @class TicketController
 * @extends BaseController
 */
class TicketController extends BaseController {
  constructor() {
    super(ticketService, 'Ticket');
  }
}

export default new TicketController();
