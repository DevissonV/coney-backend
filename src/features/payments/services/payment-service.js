import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import paymentRepository from '../repositories/payment-repository.js';
import { validatePaymentCreate } from '../validations/payment-create-validation.js';
import { validatePaymentCriteria } from '../validations/payment-criteria-validation.js';
import { validatePaymentUpdate } from '../validations/payment-update-validation.js';
import {
  createPaymentDto,
  updatePaymentDto,
  searchPaymentDto,
  generatePaymentDto,
} from '../dto/payment-dto.js';
import { paymentExternalService } from '../services/payment-dependencies.js';

/**
 * Service class for handling payment business logic.
 * @class PaymentService
 */
class PaymentService {
  /**
   * Retrieves all payments.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of payments.
   */
  async getAll(params) {
    try {
      const validatedParams = validatePaymentCriteria(params);
      const dto = searchPaymentDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        raffle_id: { column: 'raffle_id', operator: '=' },
        stripe_session_id: { column: 'stripe_session_id', operator: '=' },
        status: { column: 'status', operator: '=' },
      });

      return await paymentRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll payments: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving payments',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single payment by ID.
   * @param {number} id - Payment ID.
   * @returns {Promise<Object>} Payment data.
   */
  async getById(id) {
    try {
      const payment = await paymentRepository.getById(id);
      if (!payment) throw new AppError(`Payment with ID ${id} not found`, 404);
      return payment;
    } catch (error) {
      getLogger().error(`Error getById payment: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving payment',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new payments.
   * @param {Object} data - Payments details.
   * @returns {Promise<Object>} Created payments data.
   */
  async create(data) {
    try {
      const paymentSessionDto = generatePaymentDto(data);
      const { sessionId, sessionUrl } =
        await paymentExternalService.createSession(paymentSessionDto);

      validatePaymentCreate({
        ...data,
        stripeSessionId: sessionId,
      });

      const paymentDto = createPaymentDto({
        ...data,
        stripe_session_id: sessionId,
      });

      const payment = await paymentRepository.create(paymentDto);
      return { ...payment, stripe_session_url: sessionUrl };
    } catch (error) {
      getLogger().error(`Error create payment: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating payment',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing payment.
   * @param {number} id - Payment ID.
   * @param {Object} data - Updated Payment details.
   * @returns {Promise<Object>} Updated payment data.
   */
  async update(id, data) {
    try {
      const payment = await this.getById(id);
      validatePaymentUpdate(data);
      const dto = updatePaymentDto(data);
      return await paymentRepository.update(payment.id, dto);
    } catch (error) {
      getLogger().error(`Error update payment: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while updating payment',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes a payment by ID.
   * @param {number} id - Payment ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const payment = await this.getById(id);
      return await paymentRepository.delete(payment.id);
    } catch (error) {
      getLogger().error(`Error delete payment: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting payment',
        error.statusCode || 500,
      );
    }
  }
}

export default new PaymentService();
