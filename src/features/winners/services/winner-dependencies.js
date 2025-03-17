import raffleRepository from '../../raffles/repositories/raffle-repository.js';
import ticketRepository from '../../tickets/repositories/ticket-repository.js';
import winnerRepository from '../repositories/winner-repository.js';
import WinnerLogicService from './winner-logic-service.js';

const winnerLogicServiceInstance = new WinnerLogicService({
  raffleRepository,
  ticketRepository,
  winnerRepository,
});

export { winnerLogicServiceInstance as winnerLogicService };
