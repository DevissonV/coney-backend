import dayjs from 'dayjs';

/**
 * Transforms the validated payment data into a DTO for creation.
 * @param {Object} data - The validated payment data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createPaymentDto = (data) => ({
  amount: data.amount,
  currency: data.currency || 'COP',
  raffle_id: data.raffleId,
  tickets: JSON.stringify(data.tickets),
  stripe_session_id: data.stripe_session_id,
  status: data.status || 'pending',
});

/**
 * Transforms the validated payment data into a DTO for updating.
 * @param {Object} data - The validated payment data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const updatePaymentDto = (data) => ({
  status: data.status,
  updated_at: dayjs().toISOString(),
});

/**
 * Transforms the validated search criteria into a DTO for filtering payments.
 * @param {Object} params - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const searchPaymentDto = (data) => ({
  raffle_id: data.raffle_id,
  status: data.status,
  stripe_session_id: data.stripe_session_id,
  limit: data.limit,
  page: data.page,
});

export const generatePaymentDto = (data) => ({
  amount: data.amount,
  raffleId: data.raffleId,
  tickets: data.tickets,
  currency: 'cop',
  id: data.id,
});
