import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import paymentRepository from '../repositories/payment-repository.js';

/**
 * Marks a payment as completed and updates associated tickets as paid.
 *
 * @param {number} paymentId - ID of the payment to complete.
 * @returns {Promise<Object>} Updated payment object.
 * @throws {AppError} If payment is not found or update fails.
 */
export const PaymentCompletionService = async (paymentId) => {
  try {
    const payment = await paymentRepository.getById(paymentId);

    if (!payment) throw new AppError('Payment not found', 404);

    await paymentRepository.update(paymentId, { status: 'completed' });

    const ticketIds = Array.isArray(payment.tickets)
      ? payment.tickets
      : JSON.parse(payment.tickets);

    await ticketRepository.markTicketsAsPaid(ticketIds);

    getLogger().info(
      `Payment ${paymentId} marked as completed and tickets updated.`,
    );
    return { success: true };
  } catch (error) {
    getLogger().error(`Error in markPaymentAsCompleted: ${error.message}`);
    throw new AppError(
      error.message || 'Error marking payment as completed',
      500,
    );
  }
};
