import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import winnerRepository from '../repositories/winner-repository.js';

import RaffleService from '#features/raffles/services/raffle-service.js';
import raffleTicketService from '#features/raffles/services/raffle-ticket-service.js';
import WinnerLogicService from './winner-logic-service.js';

const raffleService = new RaffleService(raffleTicketService);

const winnerLogicService = new WinnerLogicService({
  ticketRepository,
  winnerRepository,
  raffleService,
});

export { winnerLogicService };
