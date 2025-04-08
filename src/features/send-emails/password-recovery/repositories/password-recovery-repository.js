import db from '#core/config/database.js';

/**
 * Inserts a new password recovery token into the database.
 * @param {number} userId - ID of the user requesting recovery.
 * @param {string} token - Unique token generated for password reset.
 * @param {Date} expiresAt - Expiration date/time of the token.
 * @returns {Promise<void>}
 */
export const createRecoveryToken = async (userId, token, expiresAt) => {
  await db('password_recovery_tokens').insert({
    user_id: userId,
    token,
    expires_at: expiresAt,
    used: false,
    created_at: new Date(),
  });
};

/**
 * Retrieves a valid, unused, and non-expired token from the database.
 * @param {string} token - The token string to validate.
 * @returns {Promise<Object|null>} Token record or null if invalid.
 */
export const findValidToken = async (token) => {
  return await db('password_recovery_tokens')
    .where({ token, used: false })
    .andWhere('expires_at', '>', new Date())
    .first();
};

/**
 * Marks a token as used to prevent reuse.
 * @param {string} token - The token to mark as used.
 * @returns {Promise<number>} Number of updated rows.
 */
export const markTokenAsUsed = async (token) => {
  return await db('password_recovery_tokens')
    .where({ token })
    .update({ used: true, updated_at: new Date() });
};
