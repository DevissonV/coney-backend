import dayjs from 'dayjs';

/**
 * Transforms validated data into a DTO for creating an authorization record.
 *
 * @param {Object} data - Validated authorization data.
 * @param {number} data.raffleId - ID of the raffle.
 * @param {string} data.status - Initial status (optional).
 * @param {string} [data.ticketText] - Optional text for the ticket.
 * @param {number} data.createdBy - ID of the user creating the record.
 * @returns {Object} DTO for insertion into the database.
 */
export const createAuthorizationDto = (data) => ({
  raffle_id: data.raffleId,
  status: data.status || 'pending',
  ticket_text: data.ticketText || null,
  created_by: data.createdBy,
});

/**
 * Transforms validated data into a DTO for updating an authorization record.
 *
 * @param {Object} data - Validated update data.
 * @param {string} [data.status] - New status (optional).
 * @param {string} [data.ticketText] - Updated ticket text (optional).
 * @param {string} [data.rejectionReason] - Reason for rejection (optional).
 * @returns {Object} DTO for updating the database record.
 */
export const updateAuthorizationDto = (data) => ({
  ...(data.status && { status: data.status }),
  ...(data.ticketText && { ticket_text: data.ticketText }),
  ...(data.rejectionReason && { rejection_reason: data.rejectionReason }),
  updated_at: dayjs().toISOString(),
});
