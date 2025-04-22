import { sendEmail } from '../../email-sender.js';
import { EMAIL_TYPES } from '../../email-types.js';
import { getLogger } from '#core/utils/logger/logger.js';

/**
 * Service to handle sending email notifications related to authorization status.
 */
export class AuthorizationNotificationService {
  /**
   * Sends a status change notification to the authorization creator.
   *
   * @param {Object} authorization - Authorization object with status, rejection_reason, and raffle info.
   * @param {Object} user - User object with first_name, last_name, and email.
   * @returns {Promise<void>}
   */
  async notifyAuthorizationStatusChange(authorization, user) {
    const to = user.email;
    const userFullName = `${user.first_name} ${user.last_name}`;
    const status = authorization.status;

    if (!to || !['approved', 'rejected'].includes(status)) return;

    const type =
      status === 'approved'
        ? EMAIL_TYPES.AUTH_APPROVED
        : EMAIL_TYPES.AUTH_REJECTED;

    const data = {
      userFullName,
      raffleName: authorization.raffle?.name || 'una de tus rifas',
      rejectionReason:
        authorization.rejection_reason || authorization.rejectionReason || '',
    };

    try {
      await sendEmail({ to, type, data });
      getLogger().info(`[AUTH_EMAIL] Sent ${status} email to ${to}`);
    } catch (err) {
      getLogger().error(
        `[AUTH_EMAIL] Failed to send ${status} email to ${to}: ${err.message}`,
      );
      throw err;
    }
  }
}

export const AuthorizationNotificationServiceInstance =
  new AuthorizationNotificationService();
