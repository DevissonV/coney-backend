import { AppError } from '#core/utils/response/error-handler.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import {
  notifyParticipantsOfWinner,
  notifyWinnerUser,
} from './winner-notification-service.js';
import db from '#core/config/database.js';

/**
 * Service for handling the extra business logic related to winner selection.
 * @class WinnerLogicService
 */
class WinnerLogicService {
  /**
   * Creates an instance of WinnerLogicService.
   * @param {Object} deps - The dependencies needed by the service.
   * @param {Object} deps.ticketRepository - Repository for tickets.
   * @param {Object} deps.winnerRepository - Repository for winners.
   * @param {Object} deps.raffleService    - Service for raffles.
   */
  constructor({ ticketRepository, winnerRepository, raffleService }) {
    this.ticketRepository = ticketRepository;
    this.winnerRepository = winnerRepository;
    this.raffleService = raffleService;
  }

  /**
   * Validates that a raffle exists and does not already have a winner.
   * @param {number} raffle_id - The raffle ID to check.
   * @returns {Promise<void>}
   * @throws {AppError} If the raffle doesn't exist or already has a winner.
   */
  async validateRaffleAndExistingWinner(raffle_id) {
    await this.raffleService.getById(raffle_id);

    const criteria = new GenericCriteria(
      { raffle_id },
      {
        raffle_id: { column: 'w.raffle_id', operator: '=' },
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
   * @param {number} userSessionId - ID the session user.
   * @returns {Promise<Object>} The created winner record.
   */
  async createWinner(raffle_id, createWinnerDto, userSessionId) {
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

    const winnerResponse = await this.winnerRepository.create(dto);

    await this.raffleService.update(
      raffle_id,
      {
        isActive: false,
        updatedBy: userSessionId,
      },
      { id: userSessionId },
    );

    const raffle = await this.raffleService.getById(raffle_id);

    const winnerUser = await db('users')
      .select('id', 'email', 'first_name', 'last_name')
      .where('id', winnerTicket.user_id)
      .first();

    await notifyParticipantsOfWinner(raffle, winnerTicket.ticket_number);
    await notifyWinnerUser(winnerUser, raffle, winnerTicket.ticket_number);

    return winnerResponse;
  }
}

export default WinnerLogicService;
