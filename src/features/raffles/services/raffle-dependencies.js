import ticketService from '#features/tickets/services/ticket-service.js';
import RaffleTicketService from './raffle-ticket-service.js';
import RaffleService from './raffle-service.js';
import RafflePhotoService from './raffle-photo-service.js';
import { uploadFileToS3 } from '../../uploads/services/upload-service.js';

/**
 * Dependency Injection Container for the Raffle feature.
 * This file manages the dependencies of the raffle services to ensure modularity.
 */

const raffleTicketServiceInstance = new RaffleTicketService(ticketService);
const raffleServiceInstance = new RaffleService(raffleTicketServiceInstance);
const rafflePhotoService = new RafflePhotoService(uploadFileToS3);

export {
  raffleServiceInstance as raffleService,
  raffleTicketServiceInstance as raffleTicketService,
  rafflePhotoService,
};
