import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { EMAIL_TYPES } from '#features/send-emails/email-types.js';
import { sendEmail } from '#features/send-emails/email-sender.js';
import ticketRepository from '#features/tickets/repositories/ticket-repository.js';

/**
 * Service for handling notification emails related to raffle winners.
 * @class WinnerNotificationService
 */
class WinnerNotificationService {
  /**
   * Sends an email to all users who participated in the raffle,
   * informing them of the winning number.
   *
   * @param {Object} raffle - Raffle object (must include id and name).
   * @param {number} winningNumber - Winning ticket number.
   * @param {Object} creatorUser - Creator user object (must include first_name, last_name, email).
   * @param {number} winnerUserId - User ID of the raffle winner.
   * @returns {Promise<void>}
   */
  async notifyParticipantsOfWinner(raffle, winningNumber, creatorUser, winnerUserId) {
    try {
      const participants = (await ticketRepository.getUsersByRaffleId(raffle.id))
        .filter((user) => user.id !== winnerUserId);

      await Promise.all(
        participants.map(async (user) => {
          if (!user.email) return;

          try {
            await sendEmail({
              to: user.email,
              type: EMAIL_TYPES.WINNER_ANNOUNCEMENT,
              data: {
                raffleName: raffle.name,
                winningNumber,
                creatorFullName: `${creatorUser.first_name} ${creatorUser.last_name}`,
                creatorEmail: creatorUser.email,
              },
            });

            getLogger().info(
              `[WINNER_EMAIL] Announcement email sent to participant ${user.email} - Raffle: ${raffle.name}`,
            );
          } catch (error) {
            getLogger().error(
              `[WINNER_EMAIL] Failed to send announcement to ${user.email} - Raffle: ${raffle.name} - Error: ${error.message}`,
            );
          }
        }),
      );
    } catch (error) {
      getLogger().error(`notifyParticipantsOfWinner error: ${error.message}`);
      throw new AppError(
        error.message || 'Unexpected error while notifying participants',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Sends a personalized email to the winner of the raffle.
   *
   * @param {Object} winnerUser - Winner user object (must include email, first_name, last_name).
   * @param {Object} raffle - Raffle object (must include name and description).
   * @param {number} winningNumber - Winning ticket number.
   * @param {Object} creatorUser - Creator user object (must include first_name, last_name, email).
   * @returns {Promise<void>}
   */
  async notifyWinnerUser(winnerUser, raffle, winningNumber, creatorUser) {
    try {
      await sendEmail({
        to: winnerUser.email,
        type: EMAIL_TYPES.WINNER_NOTIFICATION,
        data: {
          userFullName: `${winnerUser.first_name} ${winnerUser.last_name}`,
          raffleName: raffle.name,
          raffleDescription: raffle.description,
          winningNumber,
          creatorFullName: `${creatorUser.first_name} ${creatorUser.last_name}`,
          creatorEmail: creatorUser.email,
        },
      });

      getLogger().info(
        `[WINNER_EMAIL] Winner notification sent to ${winnerUser.email} - Raffle: ${raffle.name}`,
      );
    } catch (error) {
      getLogger().error(
        `[WINNER_EMAIL] Failed to send winner notification to ${winnerUser.email} - Raffle: ${raffle.name} - Error: ${error.message}`,
      );
      throw new AppError(
        error.message || 'Unexpected error while notifying the winner',
        error.statusCode || 500,
      );
    }
  }
}

export default WinnerNotificationService;
