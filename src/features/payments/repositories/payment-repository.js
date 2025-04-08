import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing payments data.
 * @class PaymentsRepository
 * @extends BaseRepository
 */
class PaymentRepository extends BaseRepository {
  constructor() {
    super('payments');
  }

  /**
   * Override: Get all payments enriched with raffle and ticket details.
   * @param {GenericCriteria} criteria
   * @returns {Promise<Object>}
   */
  async getAll(criteria) {
    const query = db('payments as p')
      .select(
        'p.id as payment_id',
        'p.amount',
        'p.currency',
        'p.status',
        'p.stripe_session_id',
        'p.stripe_session_url',
        'p.created_at',
        'p.updated_at',
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
          (
            SELECT json_agg(
              json_build_object(
                'id', t.id,
                'ticket_number', t.ticket_number,
                'raffle_id', t.raffle_id,
                'created_at', t.created_at,
                'updated_at', t.updated_at,
                'user', json_build_object(
                  'id', u.id,
                  'first_name', u.first_name,
                  'last_name', u.last_name,
                  'email', u.email
                )
              )
            )
            FROM tickets t
            LEFT JOIN users u ON u.id = t.user_id
            WHERE t.id IN (
              SELECT jsonb_array_elements_text(p.tickets)::int
            )
          ) as tickets
        `),
      )
      .join('raffles as r', 'p.raffle_id', 'r.id')
      .leftJoin('users as cu', 'r.created_by', 'cu.id');

    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db('payments as p').count('* as count');
    criteria.applyFilters(countQuery);
    const countResult = await countQuery.first();
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const rows = await query;

    const data = rows.map((row) => ({
      id: row.payment_id,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      stripe_session_id: row.stripe_session_id,
      stripe_session_url: row.stripe_session_url,
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
      tickets: row.tickets || [],
    }));

    return {
      data,
      total,
      page: criteria.getPagination().page,
      totalPages: Math.ceil(total / criteria.getPagination().limit),
    };
  }

  /**
   * Gets all pending payments that are older than a given timestamp.
   *
   * @param {string} cutoffISO - ISO timestamp to compare against.
   * @returns {Promise<Object[]>} List of expired pending payments.
   */
  async getExpiredPendingPayments(cutoffISO) {
    return db(this.tableName)
      .select('*')
      .where('status', 'pending')
      .andWhere('created_at', '<', cutoffISO);
  }
}

export default new PaymentRepository();
