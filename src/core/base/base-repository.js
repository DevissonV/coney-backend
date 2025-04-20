import db from '../config/database.js';

/**
 * Base repository class providing generic CRUD operations.
 * @class BaseRepository
 */
export default class BaseRepository {
  /**
   * @param {string} tableName - The name of the database table.
   */
  constructor(tableName) {
    /**
     * Database table name.
     * @type {string}
     * @protected
     */
    this.tableName = tableName;
  }

  /**
   * Removes sensitive fields from a record.
   * This method can be overridden in child repositories.
   *
   * @param {Object} record - The record object.
   * @returns {Object} The sanitized record.
   * @protected
   */
  sanitizeRecord(record) {
    return record;
  }

  /**
   * Retrieves all records with optional filtering and pagination.
   * Applies `sanitizeRecord()` to each result.
   *
   * @param {GenericCriteria} criteria - Criteria object for query customization.
   * @returns {Promise<Object>} Paginated list of records.
   */
  async getAll(criteria) {
    const query = db(this.tableName);
    criteria.applyFilters(query);
    criteria.applyPagination(query);

    const countQuery = db(this.tableName);
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
   * Retrieves a record by ID.
   * Applies `sanitizeRecord()` before returning.
   *
   * @param {number} id - Record ID.
   * @returns {Promise<Object|null>} Record data or null if not found.
   */
  async getById(id) {
    const record = await db(this.tableName).where({ id }).first();
    return record ? this.sanitizeRecord(record) : null;
  }

  /**
   * Creates a new record.
   * Applies `sanitizeRecord()` before returning.
   *
   * @param {Object} data - Record data.
   * @returns {Promise<Object>} Created record.
   */
  async create(data) {
    const [record] = await db(this.tableName).insert(data).returning('*');
    return this.sanitizeRecord(record);
  }

  /**
   * Updates an existing record by ID.
   * Applies `sanitizeRecord()` before returning.
   *
   * @param {number} id - Record ID.
   * @param {Object} data - Updated record data.
   * @returns {Promise<Object>} Updated record.
   */
  async update(id, data) {
    const [record] = await db(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');

    return this.sanitizeRecord(record);
  }

  /**
   * Deletes a record by ID.
   * @param {number} id - Record ID.
   * @returns {Promise<number>} Number of deleted rows.
   */
  async delete(id) {
    return await db(this.tableName).where({ id }).del();
  }

  /**
   * Retrieves all records that match a specific field.
   *
   * @param {string} field - The column name to filter by.
   * @param {any} value - The value to match.
   * @returns {Promise<Object[]>} Array of matching records.
   */
  async findManyByField(field, value) {
    const records = await db(this.tableName).where(field, value);
    return records.map(this.sanitizeRecord.bind(this));
  }
}
