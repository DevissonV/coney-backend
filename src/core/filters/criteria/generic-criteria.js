/**
 * Generic criteria class for handling query filters and pagination.
 * @class GenericCriteria
 */
class GenericCriteria {
  /** @private {number} */
  #limit;

  /** @private {number} */
  #page;

  /** @private {Object} */
  #filters;

  /** @private {Object} */
  #filterConfig;

  /**
   * Creates an instance of GenericCriteria.
   * @param {Object} params - Query parameters.
   * @param {Object} filterConfig - Configuration for allowed filters and their respective SQL operators.
   */
  constructor(params, filterConfig) {
    this.#limit = parseInt(params.limit, 10) || 10;
    this.#page = parseInt(params.page, 10) || 1;
    this.#filterConfig = filterConfig;

    this.#filters = Object.keys(params)
      .filter(
        (key) =>
          Object.keys(filterConfig).includes(key) && params[key] !== undefined,
      )
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
  }

  /**
   * Applies filters to a query dynamically based on the provided filterConfig.
   * @param {import("knex").QueryBuilder} query - Knex query builder instance.
   */
  applyFilters(query) {
    Object.entries(this.#filters).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      const { column, operator } = this.#filterConfig[key];

      switch (operator) {
        case 'like':
          query.where(column, 'like', `%${value}%`);
          break;
        case '>=':
          query.where(column, '>=', value);
          break;
        case '<=':
          query.where(column, '<=', value);
          break;
        case '=':
          query.where(column, '=', value);
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    });
  }

  /**
   * Applies pagination to a query.
   * @param {import("knex").QueryBuilder} query - Knex query builder instance.
   */
  applyPagination(query) {
    const offset = (this.#page - 1) * this.#limit;
    query.limit(this.#limit).offset(offset);
  }

  /**
   * Gets pagination details.
   * @returns {{ limit: number, page: number }}
   */
  getPagination() {
    return { limit: this.#limit, page: this.#page };
  }
}

export default GenericCriteria;
