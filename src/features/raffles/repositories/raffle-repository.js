import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing raffles data.
 * @class RaffleRepository
 * @extends BaseRepository
 */
class RaffleRepository extends BaseRepository {
  constructor() {
    super('raffles');
  }

  /**
   * Overrides the `getAll` method from `BaseRepository`.
   * Retrieves all raffles with filtering and pagination, including available ticket count and authorization status.
   *
   * @override
   * @param {GenericCriteria} criteria - Criteria object for query customization.
   * @returns {Promise<Object>} Paginated list of raffles.
   */
  async getAll(criteria) {
    const query = db(this.tableName)
      .leftJoin('tickets', 'raffles.id', 'tickets.raffle_id')
      .leftJoin('raffle_authorizations as a', 'raffles.id', 'a.raffle_id')
      .select(
        'raffles.*',
        'a.status as authorization_status',
        db.raw(
          'COUNT(CASE WHEN tickets.user_id IS NULL THEN 1 END) AS available_tickets',
        ),
      )
      .groupBy('raffles.id', 'a.status');

    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db(this.tableName).leftJoin(
      'raffle_authorizations as a',
      'raffles.id',
      'a.raffle_id',
    );

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

export default new RaffleRepository();
