import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import winnerRepository from '../repositories/winner-repository.js';
import userRepository from '#features/users/repositories/user-repository.js';

import RaffleService from '#features/raffles/services/raffle-service.js';
import raffleTicketService from '#features/raffles/services/raffle-ticket-service.js';
import WinnerLogicService from './winner-logic-service.js';
import WinnerNotificationService from '#features/send-emails/winner-notifications/services/winner-notification-service.js';

const raffleService = new RaffleService(raffleTicketService);
const winnerNotificationService = new WinnerNotificationService();

const winnerLogicService = new WinnerLogicService({
  ticketRepository,
  winnerRepository,
  raffleService,
  winnerNotificationService,
  userRepository,
});

export { winnerLogicService };
