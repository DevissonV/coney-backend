import { getLogger } from '#core/utils/logger/logger.js';

/**
 * Builds a notifier callback that can be injected into AuthorizationService.
 *
 * @param {Object} deps
 * @param {UserRepository} deps.userRepository
 * @param {AuthorizationNotificationService} deps.authorizationNotificationService
 * @returns {(updated: Object, input: Object) => Promise<void>}
 */
export const createNotifyStatusChange = ({
  userRepository,
  authorizationNotificationService,
}) => {
  return async (updated, input) => {
    const logger = getLogger();

    if (input.status && ['approved', 'rejected'].includes(input.status)) {
      try {
        const creator = await userRepository.getBasicInfoById(
          updated.created_by,
        );
        await authorizationNotificationService.notifyAuthorizationStatusChange(
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
};
