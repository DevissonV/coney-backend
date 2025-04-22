import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

class AuthorizationRepository extends BaseRepository {
  constructor() {
    super('raffle_authorizations');
  }

  /**
   * Retrieves paginated and filtered authorizations, including creator and raffle info.
   * @param {GenericCriteria} criteria
   * @returns {Promise<Object>}
   */
  async getAll(criteria) {
    const query = db(`${this.tableName} as a`)
      .leftJoin('users as u', 'a.created_by', 'u.id')
      .leftJoin('raffles as r', 'a.raffle_id', 'r.id')
      .select(
        'a.id',
        'a.status',
        'a.ticket_text',
        'a.rejection_reason',
        'a.created_at',
        'a.updated_at',
        db.raw(`
          json_build_object(
            'id', r.id,
            'name', r.name,
            'description', r.description,
            'image_url', r.photo_url,
            'init_date', r.init_date,
            'end_date', r.end_date,
            'created_at', r.created_at
          ) as raffle
        `),
        db.raw(`
          json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'email', u.email
          ) as created_by
        `),
      );

    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db(`${this.tableName} as a`).count('* as count');
    criteria.applyFilters(countQuery);
    const countResult = await countQuery.first();
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const data = await query;

    return {
      data,
      total,
      page: criteria.getPagination().page,
      totalPages: Math.ceil(total / criteria.getPagination().limit),
    };
  }
}

export default new AuthorizationRepository();
