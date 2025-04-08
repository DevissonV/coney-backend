import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';

import { validatePasswordRecoveryRequest } from '../validations/password-recovery-validation.js';
import { validatePasswordResetRequest } from '../validations/password-reset-validation.js';

import {
  createPasswordRecoveryDto,
  createResetPasswordDto,
} from '../dto/password-recovery-dto.js';

import {
  createRecoveryToken,
  findValidToken,
  markTokenAsUsed,
} from '../repositories/password-recovery-repository.js';

import { EMAIL_TYPES } from '../../email-types.js';
import { sendEmail } from '../../email-sender.js';
import userRepository from '#features/users/repositories/user-repository.js';

/**
 * Service class for handling password recovery business logic.
 * @class PasswordRecoveryService
 */
class PasswordRecoveryService {
  /**
   * Sends a password recovery email to the user.
   * @param {Object} data - Request data containing the email.
   * @returns {Promise<Object>} Success response object.
   */
  async requestRecovery(data) {
    try {
      const validated = validatePasswordRecoveryRequest(data);
      const { email } = createPasswordRecoveryDto(validated);

      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AppError('No user found with the provided email', 404);
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await createRecoveryToken(user.id, token, expiresAt);

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await sendEmail({
        to: user.email,
        type: EMAIL_TYPES.PASSWORD_RECOVERY,
        data: { resetUrl },
      });

      return { emailSent: true };
    } catch (error) {
      getLogger().error(`Error in requestRecovery: ${error.message}`);
      throw new AppError(
        error.message || 'Unexpected error while sending recovery email',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Resets a user's password using a valid token.
   * @param {Object} data - Request data containing token and new password.
   * @returns {Promise<Object>} Success response object.
   */
  async resetPassword(data) {
    try {
      const validated = validatePasswordResetRequest(data);
      const { token, newPassword } = createResetPasswordDto(validated);

      const tokenRecord = await findValidToken(token);
      if (!tokenRecord) {
        throw new AppError('Invalid or expired token', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updatePassword(tokenRecord.user_id, hashedPassword);
      await markTokenAsUsed(token);

      return { passwordUpdated: true };
    } catch (error) {
      getLogger().error(`Error in resetPassword: ${error.message}`);
      throw new AppError(
        error.message || 'Unexpected error while resetting password',
        error.statusCode || 500,
      );
    }
  }
}

export default new PasswordRecoveryService();
