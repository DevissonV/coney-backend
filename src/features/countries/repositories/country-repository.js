import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing countries data.
 * @class CountriesRepository
 * @extends BaseRepository
 */
class CountryRepository extends BaseRepository {
  constructor() {
    super('countries');
  }
}

export default new CountryRepository();