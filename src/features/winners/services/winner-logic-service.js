import { AppError } from '#core/utils/response/error-handler.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';

/**
 * Service for handling the extra business logic related to winner selection.
 * @class WinnerLogicService
 */
class WinnerLogicService {
  /**
   * Creates an instance of WinnerLogicService.
   * @param {Object} deps - The dependencies needed by the service.
   * @param {Object} deps.raffleRepository - Repository for raffles.
   * @param {Object} deps.ticketRepository - Repository for tickets.
   * @param {Object} deps.winnerRepository - Repository for winners.
   */
  constructor({ raffleRepository, ticketRepository, winnerRepository }) {
    this.raffleRepository = raffleRepository;
    this.ticketRepository = ticketRepository;
    this.winnerRepository = winnerRepository;
  }

  /**
   * Validates that a raffle exists and does not already have a winner.
   * @param {number} raffle_id - The raffle ID to check.
   * @returns {Promise<void>}
   * @throws {AppError} If the raffle doesn't exist or already has a winner.
   */
  async validateRaffleAndExistingWinner(raffle_id) {
    const raffle = await this.raffleRepository.getById(raffle_id);
    if (!raffle) {
      throw new AppError(`Raffle with ID ${raffle_id} not found`, 404);
    }
    const criteria = new GenericCriteria(
      { raffle_id },
      {
        raffle_id: { column: 'raffle_id', operator: '=' },
      },
    );
    const winnersResult = await this.winnerRepository.getAll(criteria);
    if (winnersResult.total > 0) {
      throw new AppError(
        `A winner has already been selected for raffle ${raffle_id}`,
        400,
      );
    }
  }

  /**
   * Retrieves a random reserved ticket for a given raffle.
   * Reserved tickets are those that have a user_id assigned.
   * @param {number} raffle_id - The raffle ID.
   * @returns {Promise<Object|null>} The selected ticket or null if none are eligible.
   */
  async getRandomReservedTicket(raffle_id) {
    const reservedTickets =
      await this.ticketRepository.getReservedTickets(raffle_id);
    if (reservedTickets.length === 0) return null;
    return reservedTickets[Math.floor(Math.random() * reservedTickets.length)];
  }

  /**
   * Creates a new winner for a given raffle.
   * Validates that the raffle exists, that no winner has been selected yet,
   * selects a random reserved ticket, and creates the winner record.
   *
   * @param {number} raffle_id - The raffle ID.
   * @param {Function} createWinnerDto - Function to transform data into a DTO.
   * @returns {Promise<Object>} The created winner record.
   */
  async createWinner(raffle_id, createWinnerDto) {
    await this.validateRaffleAndExistingWinner(raffle_id);
    const winnerTicket = await this.getRandomReservedTicket(raffle_id);
    if (!winnerTicket) {
      throw new AppError('No eligible tickets found', 400);
    }
    const dto = createWinnerDto({
      raffle_id,
      ticket_id: winnerTicket.id,
      user_id: winnerTicket.user_id,
    });
    return await this.winnerRepository.create(dto);
  }
}

export default WinnerLogicService;
