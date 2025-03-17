import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';

/**
 * Service for managing ticket generation for raffles.
 * Handles bulk ticket creation when a raffle is created.
 * @class RaffleTicketService
 */
class RaffleTicketService {
  /**
   * @param {Object} ticketService - Instance of the ticket service.
   */
  constructor(ticketService) {
    this.ticketService = ticketService;
  }

  /**
   * Generates tickets for a given raffle.
   * Each ticket is associated with the raffle provided in the parameter.
   *
   * @param {number} raffleId - The unique identifier of the raffle.
   * @param {number} ticketCount - The number of tickets to generate.
   * @returns {Promise<void>} A promise that resolves when all tickets have been created.
   * @throws {AppError} Throws an error if any ticket creation fails.
   */
  async generateTicketsForRaffle(raffleId, ticketCount) {
    try {
      const ticketPromises = [];
      for (let i = 1; i <= ticketCount; i++) {
        const dataTicket = {
          ticketNumber: i,
          raffleId: raffleId,
          userId: null,
        };
        ticketPromises.push(this.ticketService.create(dataTicket));
      }

      await Promise.all(ticketPromises);
    } catch (error) {
      getLogger().error(
        `Error generating tickets for raffle ${raffleId}: ${error.message}`,
      );
      throw new AppError(
        error.message || 'Database error while generating raffle tickets',
        error.statusCode || 500,
      );
    }
  }
}

export default RaffleTicketService;
