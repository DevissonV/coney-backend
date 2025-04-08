import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { envs } from '#core/config/envs.js';
import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import dayjs from 'dayjs';
import paymentRepository from '../repositories/payment-repository.js';

/**
 * Service that checks for expired pending payments and releases associated tickets.
 * This is intended to be invoked manually (not via cron), e.g. when fetching raffles or payments.
 *
 * @returns {Promise<Object>} Summary of processed payments.
 */
export const PaymentValidationService = async () => {
  try {
    const expirationMinutes = parseInt(
      envs.PAYMENT_PENDING_EXPIRATION_MINUTES || '60',
      10,
    );
    const cutoffTime = dayjs().subtract(expirationMinutes, 'minute');

    const pendingPayments = await paymentRepository.getExpiredPendingPayments(
      cutoffTime.toISOString(),
    );

    if (!pendingPayments.length) {
      getLogger().info('No expired pending payments found');
      return { expiredPayments: 0 };
    }

    await Promise.all(
      pendingPayments.map(async (payment) => {
        const ticketIds = Array.isArray(payment.tickets)
          ? payment.tickets
          : JSON.parse(payment.tickets);

        await paymentRepository.update(payment.id, { status: 'failed' });
        await ticketRepository.releaseTickets(ticketIds);

        getLogger().info(
          `Marked payment ${payment.id} as failed and released ${ticketIds.length} tickets.`,
        );
      }),
    );

    return { expiredPayments: pendingPayments.length };
  } catch (error) {
    getLogger().error(`Error validating pending payments: ${error.message}`);
    throw new AppError('Error validating pending payments', 500);
  }
};
