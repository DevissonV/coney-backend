import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing raffles data.
 * @class RafflesRepository
 * @extends BaseRepository
 */
class RaffleRepository extends BaseRepository {
  constructor() {
    super('raffles');
  }
}

export default new RaffleRepository();