import nodemailer from 'nodemailer';
import { generateEmailContent } from './email-factory.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { envs } from '#core/config/envs.js';

const transporter = nodemailer.createTransport({
  host: envs.SMTP_HOST,
  port: envs.SMTP_PORT,
  secure: envs.SMTP_SECURE === 'true',
  auth: {
    user: envs.SMTP_USER,
    pass: envs.SMTP_PASS,
  },
});

/**
 * Sends an email using a specified type and template.
 *
 * @param {Object} options - Email sending options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.type - Email type from EMAIL_TYPES.
 * @param {Object} options.data - Dynamic data for the template.
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, type, data }) => {
  try {
    const { subject, html } = generateEmailContent(type, data);

    await transporter.sendMail({
      from: `"Coney" <${envs.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    getLogger().info(`Email sent to ${to} [${type}]`);
  } catch (error) {
    getLogger().error(`Error sending email to ${to}: ${error.message}`);
    throw error;
  }
};
