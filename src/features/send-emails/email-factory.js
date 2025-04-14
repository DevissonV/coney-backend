import { EMAIL_TYPES } from './email-types.js';
import { getPasswordRecoveryTemplate } from './templates/users/password-recovery-template.js';
import { getWinnerAnnouncementTemplate } from './templates/winners/winner-announcement-template.js';
import { getWinnerNotificationTemplate } from './templates/winners/winner-notification-template.js';

/**
 * Returns the email subject and HTML/text body based on the email type and data.
 *
 * @param {string} type - Email type from EMAIL_TYPES.
 * @param {Object} data - Dynamic data to inject into the template.
 * @returns {Object} An object with subject and html body.
 */
export const emailFactory = (type, data) => {
  switch (type) {
    case EMAIL_TYPES.PASSWORD_RECOVERY:
      return getPasswordRecoveryTemplate(data);
    case EMAIL_TYPES.WINNER_ANNOUNCEMENT:
      return getWinnerAnnouncementTemplate(data);
    case EMAIL_TYPES.WINNER_NOTIFICATION:
      return getWinnerNotificationTemplate(data);
    default:
      throw new Error(`Email type "${type}" not supported.`);
  }
};
