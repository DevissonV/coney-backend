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

/**
 * Service class for handling raffle business logic.
 * @class RaffleService
 */
class RaffleService {
  /**
   * @param {Object} raffleTicketService - Instance of the raffle ticket service.
   */
  constructor(raffleTicketService) {
    this.raffleTicketService = raffleTicketService;
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
        is_active: { column: 'is_active', operator: '=' },
        created_by: { column: 'created_by', operator: '=' },
        updated_by: { column: 'updated_by', operator: '=' },
        authorization_status: { column: 'a.status', operator: '=' },
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
   * @param {Object} sessionUser - user token information
   * @returns {Promise<Object>} Created raffles data.
   */
  async create(data, sessionUser) {
    try {
      data.createdBy = sessionUser.id;
      validateRaffleCreate(data);

      const dto = createRaffleDto(data);
      const resCreatedRaffle = await raffleRepository.create(dto);

      await this.raffleTicketService.generateTicketsForRaffle(
        resCreatedRaffle.id,
        dto.tickets_created,
      );

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
   * @param {Object} sessionUser - user token information
   * @returns {Promise<Object>} Updated raffle data.
   */
  async update(id, data, sessionUser) {
    try {
      const raffle = await this.getById(id);

      data.updatedBy = sessionUser.id;
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
}

export default RaffleService;
