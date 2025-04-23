import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Service for handling the completion of a payment.
 * Marks the payment as completed and updates the associated tickets.
 */
export default class PaymentCompletionService {
  constructor(paymentRepository, ticketRepository, logger) {
    this.paymentRepository = paymentRepository;
    this.ticketRepository = ticketRepository;
    this.logger = logger;
  }

  /**
   * Marks a payment as completed and updates associated tickets as paid.
   *
   * @param {number} paymentId - ID of the payment to complete.
   * @returns {Promise<{ success: boolean }>} Confirmation object.
   * @throws {AppError} If the payment is not found or an error occurs during the update.
   */
  async markAsCompleted(paymentId) {
    try {
      const payment = await this.paymentRepository.getById(paymentId);

      if (!payment) throw new AppError('Payment not found', 404);

      await this.paymentRepository.update(paymentId, { status: 'completed' });

      const ticketIds = Array.isArray(payment.tickets)
        ? payment.tickets
        : JSON.parse(payment.tickets);

      await this.ticketRepository.markTicketsAsPaid(ticketIds);

      this.logger.info(
        `Payment ${paymentId} marked as completed and tickets updated.`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Error in markPaymentAsCompleted: ${error.message}`);
      throw new AppError(
        error.message || 'Error marking payment as completed',
        500,
      );
    }
  }
}
