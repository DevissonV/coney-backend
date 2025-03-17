import ticketService from '#features/tickets/services/ticket-service.js';
import RaffleTicketService from './raffle-ticket-service.js';
import RaffleService from './raffle-service.js';

/**
 * Dependency Injection Container for the Raffle feature.
 * This file manages the dependencies of the raffle services to ensure modularity.
 */

const raffleTicketServiceInstance = new RaffleTicketService(ticketService);
const raffleServiceInstance = new RaffleService(raffleTicketServiceInstance);

export {
  raffleServiceInstance as raffleService,
  raffleTicketServiceInstance as raffleTicketService,
};
