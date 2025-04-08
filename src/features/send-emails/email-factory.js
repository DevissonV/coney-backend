import { EMAIL_TYPES } from './email-types.js';
import { getPasswordRecoveryTemplate } from './templates/password-recovery-template.js';
// import { getPaymentConfirmationTemplate } from './templates/payment-confirmation-template.js';
// import { getWelcomeTemplate } from './templates/welcome-template.js';

/**
 * Returns the email subject and HTML/text body based on the email type and data.
 *
 * @param {string} type - Email type from EMAIL_TYPES.
 * @param {Object} data - Dynamic data to inject into the template.
 * @returns {Object} An object with subject and html body.
 */
export const generateEmailContent = (type, data) => {
  switch (type) {
    case EMAIL_TYPES.PASSWORD_RECOVERY:
      return getPasswordRecoveryTemplate(data);
    // case EMAIL_TYPES.PAYMENT_CONFIRMATION:
    //   return getPaymentConfirmationTemplate(data);
    // case EMAIL_TYPES.WELCOME:
    //   return getWelcomeTemplate(data);
    default:
      throw new Error(`Unsupported email type: ${type}`);
  }
};
