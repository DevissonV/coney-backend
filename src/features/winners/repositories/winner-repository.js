import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing winners data.
 * @class WinnersRepository
 * @extends BaseRepository
 */
class WinnerRepository extends BaseRepository {
  constructor() {
    super('winners');
  }
}

export default new WinnerRepository();
