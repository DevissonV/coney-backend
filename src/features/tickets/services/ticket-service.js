import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import ticketRepository from '../repositories/ticket-repository.js';
import { validateTicket } from '../validations/ticket-validation.js';
import { validateTicketCriteria } from '../validations/ticket-criteria-validation.js';
import {
  createTicketDto,
  updateTicketDto,
  searchTicketDto,
} from '../dto/ticket-dto.js';

/**
 * Service class for handling ticket business logic.
 * @class TicketService
 */
class TicketService {
  /**
   * Retrieves all tickets.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of tickets.
   */
  async getAll(params) {
    try {
      const validatedParams = validateTicketCriteria(params);
      const dto = searchTicketDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        ticket_number: { column: 'ticket_number', operator: '=' },
        raffle_id: { column: 'raffle_id', operator: '=' },
        user_id: { column: 'user_id', operator: '=' },
      });

      return await ticketRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll tickets: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving tickets',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single ticket by ID.
   * @param {number} id - Ticket ID.
   * @returns {Promise<Object>} Ticket data.
   */
  async getById(id) {
    try {
      const ticket = await ticketRepository.getById(id);
      if (!ticket) throw new AppError(`Ticket with ID ${id} not found`, 404);
      return ticket;
    } catch (error) {
      getLogger().error(`Error getById ticket: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving ticket',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new tickets.
   * @param {Object} data - Tickets details.
   * @returns {Promise<Object>} Created tickets data.
   */
  async create(data) {
    try {
      validateTicket(data);
      const dto = createTicketDto(data);

      return await ticketRepository.create(dto);
    } catch (error) {
      getLogger().error(`Error create ticket: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating ticket',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing ticket.
   * @param {number} id - Ticket ID.
   * @param {Object} data - Updated Ticket details.
   * @returns {Promise<Object>} Updated ticket data.
   */
  async update(id, data) {
    try {
      const ticket = await this.getById(id);
      validateTicket(data);
      const dto = updateTicketDto(data);
      return await ticketRepository.update(ticket.id, dto);
    } catch (error) {
      getLogger().error(`Error update ticket: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while updating ticket',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes a ticket by ID.
   * @param {number} id - Ticket ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const ticket = await this.getById(id);
      return await ticketRepository.delete(ticket.id);
    } catch (error) {
      getLogger().error(`Error delete ticket: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting ticket',
        error.statusCode || 500,
      );
    }
  }
}

export default new TicketService();
