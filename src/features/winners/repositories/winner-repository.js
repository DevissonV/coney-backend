import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing winners data.
 * @class WinnersRepository
 * @extends BaseRepository
 */
class WinnerRepository extends BaseRepository {
  constructor() {
    super('winners');
  }

  /**
   * Override: Get all winners enriched with raffle, ticket, and user details.
   * @param {GenericCriteria} criteria
   * @returns {Promise<Object>}
   */
  async getAll(criteria) {
    const query = db('winners as w')
      .select(
        'w.id as winner_id',
        'w.created_at',
        'w.updated_at',
        'r.id as raffle_id',
        'r.name as raffle_name',
        'r.description as raffle_description',
        'r.init_date',
        'r.end_date',
        'r.price',
        'r.tickets_created',
        'r.is_active',
        db.raw(`
          json_build_object(
            'id', cu.id,
            'first_name', cu.first_name,
            'last_name', cu.last_name,
            'email', cu.email
          ) as created_by
        `),
        db.raw(`
          json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'email', u.email
          ) as winner
        `),
        db.raw(`
          json_build_object(
            'id', t.id,
            'ticket_number', t.ticket_number,
            'raffle_id', t.raffle_id,
            'created_at', t.created_at,
            'updated_at', t.updated_at
          ) as ticket
        `),
      )
      .join('raffles as r', 'w.raffle_id', 'r.id')
      .leftJoin('users as cu', 'r.created_by', 'cu.id')
      .leftJoin('users as u', 'w.user_id', 'u.id')
      .leftJoin('tickets as t', 'w.ticket_id', 't.id');

    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db('winners as w').count('* as count');
    criteria.applyFilters(countQuery);
    const countResult = await countQuery.first();
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const rows = await query;

    const data = rows.map((row) => ({
      id: row.winner_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      raffle: {
        id: row.raffle_id,
        name: row.raffle_name,
        description: row.raffle_description,
        init_date: row.init_date,
        end_date: row.end_date,
        price: row.price,
        tickets_created: row.tickets_created,
        is_active: row.is_active,
        created_by: row.created_by,
      },
      ticket: row.ticket || {},
      winner: row.winner || {},
    }));

    return {
      data,
      total,
      page: criteria.getPagination().page,
      totalPages: Math.ceil(total / criteria.getPagination().limit),
    };
  }
}

export default new WinnerRepository();
