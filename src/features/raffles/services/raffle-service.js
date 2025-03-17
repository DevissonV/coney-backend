import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import raffleRepository from '../repositories/raffle-repository.js';
import { validateRaffleCreate } from '../validations/raffle-create-validation.js';
import { validateRaffleUpdate } from '../validations/raffle-update-validation.js';
import { validateRaffleCriteria } from '../validations/raffle-criteria-validation.js';
import {
  createRaffleDto,
  updateRaffleDto,
  searchRaffleDto,
} from '../dto/raffle-dto.js';
import ticketService from '#features/tickets/services/ticket-service.js';

/**
 * Service class for handling raffle business logic.
 * @class RaffleService
 */
class RaffleService {
  /** @private */
  #ticketService;

  /**
   * inject instance of TicketService.
   *
   * @param {Object} ticketService -
   */
  constructor(ticketService) {
    /**
     * @private
     * @type {Object}
     */
    this.#ticketService = ticketService;
  }

  /**
   * Retrieves all raffles.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of raffles.
   */
  async getAll(params) {
    try {
      const validatedParams = validateRaffleCriteria(params);
      const dto = searchRaffleDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        name: { column: 'name', operator: 'like' },
        init_date: { column: 'init_date', operator: '>=' },
        end_date: { column: 'end_date', operator: '<=' },
      });

      return await raffleRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll raffles: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving raffles',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single raffle by ID.
   * @param {number} id - Raffle ID.
   * @returns {Promise<Object>} Raffle data.
   */
  async getById(id) {
    try {
      const raffle = await raffleRepository.getById(id);
      if (!raffle) throw new AppError(`Raffle with ID ${id} not found`, 404);
      return raffle;
    } catch (error) {
      getLogger().error(`Error getById raffle: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving raffle',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new raffles.
   * @param {Object} data - Raffles details.
   * @returns {Promise<Object>} Created raffles data.
   */
  async create(data) {
    try {
      validateRaffleCreate(data);

      const dto = createRaffleDto(data);
      const resCreatedRaffle = await raffleRepository.create(dto);

      await this.#createTickets(resCreatedRaffle.id, dto.tickets_created);

      return resCreatedRaffle;
    } catch (error) {
      getLogger().error(`Error create raffle: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating raffle',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing raffle.
   * @param {number} id - Raffle ID.
   * @param {Object} data - Updated Raffle details.
   * @returns {Promise<Object>} Updated raffle data.
   */
  async update(id, data) {
    try {
      const raffle = await this.getById(id);
      validateRaffleUpdate(data);
      const dto = updateRaffleDto(data);
      return await raffleRepository.update(raffle.id, dto);
    } catch (error) {
      getLogger().error(`Error update raffle: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while updating raffle',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes a raffle by ID.
   * @param {number} id - Raffle ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const raffle = await this.getById(id);
      return await raffleRepository.delete(raffle.id);
    } catch (error) {
      getLogger().error(`Error delete raffle: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting raffle',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Generates tickets associated with a given raffle.
   *
   * This method creates tickets sequentially by calling the ticket service.
   * Each ticket is associated with the raffle provided in the data parameter.
   * The number of tickets generated is defined by the TICKET_GENERATION_COUNT
   * environment variable.
   *
   * @private
   * @param {number} raffleId - The unique identifier of the raffle.
   * @returns {Promise<void>} A promise that resolves when all tickets have been created.
   * @throws {AppError} Throws an error if any ticket creation fails.
   */
  async #createTickets(raffleId, ticketCount) {
    try {
      for (let i = 1; i <= ticketCount; i++) {
        const dataTicket = {
          ticketNumber: i,
          raffleId: raffleId,
          userId: null,
        };

        await this.#ticketService.create(dataTicket);
      }
    } catch (error) {
      getLogger().error(
        `Error create tickets in module of raffle: ${error.message}`,
      );
      throw new AppError(
        error.message || 'Database error while creating raffle',
        error.statusCode || 500,
      );
    }
  }
}

export default new RaffleService(ticketService);
