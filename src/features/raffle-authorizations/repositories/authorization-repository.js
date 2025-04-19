import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing raffle authorization records in the database.
 * @class AuthorizationRepository
 * @extends BaseRepository
 */
class AuthorizationRepository extends BaseRepository {
  constructor() {
    super('raffle_authorizations');
  }
}

export default new AuthorizationRepository();
