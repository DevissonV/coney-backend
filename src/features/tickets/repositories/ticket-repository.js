import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing tickets data.
 * @class TicketRepository
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

  /**
   * Retrieves all reserved tickets for a given raffle.
   * Reserved tickets are those that have a user_id assigned.
   *
   * @param {number} raffle_id - The raffle ID.
   * @returns {Promise<Object[]>} List of reserved tickets.
   */
  async getReservedTickets(raffle_id) {
    const reservedTickets = await db(this.tableName)
      .select('*')
      .where({ raffle_id })
      .whereNotNull('user_id')
      .andWhere('is_paid', true);

    return reservedTickets.map(this.sanitizeRecord.bind(this));
  }

  /**
   * Marks multiple tickets as paid using a single update operation.
   *
   * @param {number[]} ticketIds - Array of ticket IDs to update.
   * @returns {Promise<number>} The number of updated rows.
   */
  async markTicketsAsPaid(ticketIds) {
    const result = await db(this.tableName)
      .whereIn('id', ticketIds)
      .update({ is_paid: true, updated_at: db.fn.now() });

    return result;
  }

  /**
   * Releases tickets by setting user_id to NULL for the given ticket IDs.
   *
   * @param {number[]} ticketIds - Array of ticket IDs to update.
   * @returns {Promise<number>} The number of updated rows.
   */
  async releaseTickets(ticketIds) {
    return db(this.tableName)
      .whereIn('id', ticketIds)
      .update({ user_id: null, updated_at: db.fn.now() });
  }
}

export default new TicketRepository();
