import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing authorization document records in the database.
 * @class AuthorizationDocumentRepository
 * @extends BaseRepository
 */
class AuthorizationDocumentRepository extends BaseRepository {
  constructor() {
    super('raffle_authorization_documents');
  }
}

export default new AuthorizationDocumentRepository();
