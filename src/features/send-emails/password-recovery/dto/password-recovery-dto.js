/**
 * Transforms the validated request into a DTO for initiating password recovery.
 * @param {Object} data - The validated data containing the email.
 * @returns {Object} DTO with extracted and normalized email.
 */
export const createPasswordRecoveryDto = (data) => ({
  email: data.email.trim().toLowerCase(),
});

/**
 * Transforms the validated data into a DTO for resetting password.
 * @param {Object} data - The validated data containing token and new password.
 * @returns {Object} DTO with token and password.
 */
export const createResetPasswordDto = (data) => ({
  token: data.token,
  newPassword: data.newPassword,
});
