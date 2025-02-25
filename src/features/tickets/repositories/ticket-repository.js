import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing tickets data.
 * @class TicketsRepository
 * @extends BaseRepository
 */
class TicketRepository extends BaseRepository {
  constructor() {
    super('tickets');
  }
}

export default new TicketRepository();