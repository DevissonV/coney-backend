import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import winnerRepository from '../repositories/winner-repository.js';
import { validateWinner } from '../validations/winner-validation.js';
import { validateWinnerCriteria } from '../validations/winner-criteria-validation.js';
import { createWinnerDto, searchWinnerDto } from '../dto/winner-dto.js';
import { winnerLogicService } from './winner-dependencies.js';

/**
 * Service class for handling winner CRUD operations.
 * Delegates extra business logic to WinnerLogicService.
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
      const criteria = new GenericCriteria(searchWinnerDto(validatedParams), {
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
   * Creates a new winner by delegating to WinnerLogicService.
   * @param {Object} data - Winner data.
   * @returns {Promise<Object>} Created winner data.
   */
  async create(data) {
    try {
      validateWinner(data);
      const { raffle_id } = data;

      return await winnerLogicService.createWinner(raffle_id, createWinnerDto);
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
   * Deletes a winner by ID.
   * @param {number} id - Winner ID.
   * @returns {Promise<void>} Resolves when deletion is complete.
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
}

export default new WinnerService();
