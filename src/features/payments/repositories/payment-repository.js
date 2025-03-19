import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing payments data.
 * @class PaymentsRepository
 * @extends BaseRepository
 */
class PaymentRepository extends BaseRepository {
  constructor() {
    super('payments');
  }
}

export default new PaymentRepository();
