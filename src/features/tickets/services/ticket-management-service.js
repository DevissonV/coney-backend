import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import ticketRepository from '../repositories/ticket-repository.js';
import { validateTicketCriteria } from '../validations/ticket-criteria-validation.js';
import { searchTicketDto } from '../dto/ticket-dto.js';

/**
 * Service for advanced ticket management.
 * Handles availability checks and bulk operations.
 * @class TicketManagementService
 */
class TicketManagementService {
  /**
   * Retrieves available tickets with filtering and pagination.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object>} List of available tickets.
   */
  async getAvailableTickets(params) {
    try {
      const validatedParams = validateTicketCriteria(params);
      const dto = searchTicketDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        raffle_id: { column: 'raffle_id', operator: '=' },
        ticket_number: { column: 'ticket_number', operator: '=' },
      });

      const availableTickets =
        await ticketRepository.getAvailableTickets(criteria);

      return availableTickets;
    } catch (error) {
      getLogger().error(`Error retrieving available tickets: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving available tickets',
        error.statusCode || 500,
      );
    }
  }
}

export default new TicketManagementService();
