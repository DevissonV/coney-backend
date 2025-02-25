/**
 * Transforms the validated ticket data into a DTO for creation.
 * @param {Object} data - The validated ticket data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createTicketDto = (data) => ({
  ticket_number: data.ticket_number,
  riffle_id: data.riffle_id ?? null,
  user_id: data.user_id ?? null,
});

/**
 * Transforms the validated ticket data into a DTO for updating.
 * @param {Object} data - The validated ticket data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const updateTicketDto = (data) => ({
  ticket_number: data.ticket_number,
  riffle_id: data.riffle_id ?? null,
  user_id: data.user_id ?? null,
});

/**
 * Transforms the validated search criteria into a DTO for filtering tickets.
 * @param {Object} params - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const searchTicketDto = (params) => ({
  ticket_number: params.ticket_number ?? null,
  riffle_id: params.riffle_id ?? null,
  user_id: params.user_id ?? null,
  limit: params.limit ?? 10,
  page: params.page ?? 1,
});
