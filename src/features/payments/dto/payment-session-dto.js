/**
 * Transforms the payment information into a DTO.
 * In this case, the data is returned as is.
 * @param {Object} payment - The payment information.
 * @returns {Object} The DTO for payment creation.
 */
export const createPaymentSessionDto = (payment) => ({
  amount: payment.amount,
  currency: 'cop',
  tickets: payment.tickets,
  raffleId: payment.raffleId,
});
