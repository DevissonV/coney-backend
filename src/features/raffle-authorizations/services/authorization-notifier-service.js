import userRepository from '#features/users/repositories/user-repository.js';
import { AuthorizationNotificationServiceInstance } from '#features/send-emails/authorization-notifications/services/authorization-notification-service.js';
import { getLogger } from '#core/utils/logger/logger.js';

/**
 * Function to notify user when authorization status is updated to approved or rejected.
 *
 * @param {Object} updated - The updated authorization entity.
 * @param {Object} input - The original input data.
 * @returns {Promise<void>}
 */
export const notifyStatusChange = async (updated, input) => {
  const logger = getLogger();

  if (input.status && ['approved', 'rejected'].includes(input.status)) {
    try {
      const creator = await userRepository.getBasicInfoById(updated.created_by);
      await AuthorizationNotificationServiceInstance.notifyAuthorizationStatusChange(
        updated,
        creator,
      );
      logger.info(
        `[AUTH_NOTIFY] Email sent to ${creator.email} for status ${input.status} (auth ${updated.id})`,
      );
    } catch (error) {
      logger.error(
        `[AUTH_NOTIFY] Failed to send email for auth ${updated.id}: ${error.message}`,
      );
    }
  }
};
