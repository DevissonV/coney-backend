import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing tickets data.
 * @class TicketsRepository
 * @extends BaseRepository
 */
class TicketRepository extends BaseRepository {
  constructor() {
    super('tickets');
  }

  /**
   * Retrieves all available tickets for a given raffle.
   * Applies filters and pagination.
   *
   * @param {GenericCriteria} criteria - Criteria object for query customization.
   * @returns {Promise<Object>} Paginated list of available tickets.
   */
  async getAvailableTickets(criteria) {
    const query = db(this.tableName).select('*').whereNull('user_id');

    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db(this.tableName).whereNull('user_id');
    criteria.applyFilters(countQuery);

    const totalResult = await countQuery.count('* as count').first();
    const total = totalResult ? parseInt(totalResult.count, 10) : 0;

    let data = await query;

    data = data.map(this.sanitizeRecord.bind(this));

    return {
      data,
      total,
      page: criteria.getPagination().page,
      totalPages: Math.ceil(total / criteria.getPagination().limit),
    };
  }
}

export default new TicketRepository();
