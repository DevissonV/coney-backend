import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import winnerRepository from '../repositories/winner-repository.js';
import raffleRepository from '../../raffles/repositories/raffle-repository.js';
import ticketRepository from '../../tickets/repositories/ticket-repository.js';
import { validateWinner } from '../validations/winner-validation.js';
import { validateWinnerCriteria } from '../validations/winner-criteria-validation.js';
import { createWinnerDto, searchWinnerDto } from '../dto/winner-dto.js';

/**
 * Service class for handling winner business logic.
 * @class WinnerService
 */
class WinnerService {
  /**
   * Retrieves all winners.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of winners.
   */
  async getAll(params) {
    try {
      const validatedParams = validateWinnerCriteria(params);

      const dto = searchWinnerDto(validatedParams);
      const criteria = new GenericCriteria(dto, {
        raffle_id: { column: 'raffle_id', operator: '=' },
        ticket_id: { column: 'ticket_id', operator: '=' },
        user_id: { column: 'user_id', operator: '=' },
      });

      return await winnerRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll winners: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving winners',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single winner by ID.
   * @param {number} id - Winner ID.
   * @returns {Promise<Object>} Winner data.
   */
  async getById(id) {
    try {
      const winner = await winnerRepository.getById(id);
      if (!winner) throw new AppError(`Winner with ID ${id} not found`, 404);
      return winner;
    } catch (error) {
      getLogger().error(`Error getById winners: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving winners',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new winner, selecting one automatically based on raffle tickets.
   * This method verifies that the raffle exists, that it does not have a winner yet,
   * and then selects a random eligible ticket (i.e., one that has a user_id assigned)
   * to determine the winner. Uniqueness is enforced by the database.
   *
   * @param {Object} data - Winner details containing at least the raffle_id.
   * @returns {Promise<Object>} Created winner data.
   */
  async createWinner(data) {
    try {
      validateWinner(data);
      const { raffle_id } = data;

      await this.validateRaffleAndExistingWinner(raffle_id);

      const winnerTicket = await this.getRandomEligibleTicket(raffle_id);

      if (!winnerTicket) throw new AppError('No eligible tickets found', 400);

      const dto = createWinnerDto({
        raffle_id,
        ticket_id: winnerTicket.id,
        user_id: winnerTicket.user_id,
      });

      return await winnerRepository.create(dto);
    } catch (error) {
      if (error.code === '23505') {
        getLogger().error(
          `Error createWinner: A winner has already been selected for raffle ${data.raffle_id}`,
        );
        throw new AppError(
          `A winner has already been selected for raffle ${data.raffle_id}`,
          400,
        );
      }
      getLogger().error(`Error create winner: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating winner',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Alias for createWinner to comply with BaseController.
   * @param {Object} data - Winner data.
   * @returns {Promise<Object>} Created winner data.
   */
  async create(data) {
    return await this.createWinner(data);
  }

  /**
   * Deletes a winner by ID.
   * @param {number} id - Winner ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const winner = await this.getById(id);
      return await winnerRepository.delete(winner.id);
    } catch (error) {
      getLogger().error(`Error delete winner: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting winner',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Validates that a raffle exists and does not already have a winner.
   * @param {number} raffle_id - The raffle ID to check.
   * @throws {AppError} If the raffle doesn't exist or already has a winner.
   */
  async validateRaffleAndExistingWinner(raffle_id) {
    const raffle = await raffleRepository.getById(raffle_id);
    if (!raffle)
      throw new AppError(`Raffle with ID ${raffle_id} not found`, 404);

    const criteria = new GenericCriteria({
      raffle_id: { column: 'raffle_id', operator: '=' },
    });

    const winnersResult = await winnerRepository.getAll(criteria);
    if (winnersResult.total > 0) {
      throw new AppError(
        `A winner has already been selected for raffle ${raffle_id}`,
        400,
      );
    }
  }

  /**
   * Retrieves a random eligible ticket for a given raffle.
   * @param {number} raffle_id - The raffle ID.
   * @returns {Promise<Object|null>} The selected ticket or null if none are eligible.
   */
  async getRandomEligibleTicket(raffle_id) {
    const eligibleTickets =
      await ticketRepository.getReservedTickets(raffle_id);
    return eligibleTickets.length
      ? eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)]
      : null;
  }
}

export default new WinnerService();
