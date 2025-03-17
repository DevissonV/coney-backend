/**
 * Transforms the validated winner data into a DTO for creation.
 * @param {Object} data - The validated winner data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createWinnerDto = (data) => ({
  raffle_id: data.raffle_id,
  ticket_id: data.ticket_id,
  user_id: data.user_id,
});

/**
 * Transforms the validated search criteria into a DTO for filtering winners.
 * @param {Object} data - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const searchWinnerDto = (data) => ({
  raffle_id: data.raffle_id !== undefined ? Number(data.raffle_id) : undefined,
  ticket_id: data.ticket_id !== undefined ? Number(data.ticket_id) : undefined,
  user_id: data.user_id !== undefined ? Number(data.user_id) : undefined,
  limit: data.limit,
  page: data.page,
});
