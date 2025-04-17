import { AppError } from '#core/utils/response/error-handler.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';

/**
 * Service for handling the extra business logic related to winner selection.
 * @class WinnerLogicService
 */
class WinnerLogicService {
  /**
   * Creates an instance of WinnerLogicService.
   * @param {Object} deps - The dependencies needed by the service.
   * @param {Object} deps.ticketRepository - Repository for tickets.
   * @param {Object} deps.winnerRepository - Repository for winners.
   * @param {Object} deps.raffleService - Service for raffles.
   * @param {Object} deps.winnerNotificationService - Service for sending emails related to winners.
   */
  constructor({
    ticketRepository,
    winnerRepository,
    raffleService,
    winnerNotificationService,
    userRepository,
  }) {
    this.ticketRepository = ticketRepository;
    this.winnerRepository = winnerRepository;
    this.raffleService = raffleService;
    this.winnerNotificationService = winnerNotificationService;
    this.userRepository = userRepository;
  }

  /**
   * Creates a new winner for a given raffle.
   * Validates the raffle, selects a random ticket, persists the winner, closes the raffle,
   * and sends email notifications to the winner and participants.
   *
   * @param {number} raffle_id - The raffle ID.
   * @param {Function} createWinnerDto - Function to transform data into a DTO.
   * @param {number} userSessionId - ID of the session user.
   * @returns {Promise<Object>} The created winner record.
   */
  async createWinner(raffle_id, createWinnerDto, userSessionId) {
    await this.#validateRaffleAndNoWinner(raffle_id);

    const ticket = await this.#selectRandomTicket(raffle_id);

    const dto = createWinnerDto({
      raffle_id,
      ticket_id: ticket.id,
      user_id: ticket.user_id,
    });

    const winner = await this.winnerRepository.create(dto);

    await this.#closeRaffle(raffle_id, userSessionId);

    const raffle = await this.raffleService.getById(raffle_id);
    const winnerUser = await this.userRepository.getBasicInfoById(
      ticket.user_id,
    );
    const creatorUser = await this.userRepository.getBasicInfoById(
      raffle.created_by,
    );

    this.#sendNotifications(
      raffle,
      ticket.ticket_number,
      winnerUser,
      creatorUser,
    );

    return winner;
  }

  /**
   * Validates that a raffle exists and does not already have a winner.
   * @param {number} raffle_id
   * @throws {AppError} If raffle doesn't exist or already has a winner.
   * @private
   */
  async #validateRaffleAndNoWinner(raffle_id) {
    await this.raffleService.getById(raffle_id);

    const criteria = new GenericCriteria(
      { raffle_id },
      {
        raffle_id: { column: 'w.raffle_id', operator: '=' },
      },
    );

    const result = await this.winnerRepository.getAll(criteria);
    if (result.total > 0) {
      throw new AppError(
        `A winner has already been selected for raffle ${raffle_id}`,
        400,
      );
    }
  }

  /**
   * Selects a random ticket with user assigned and paid status.
   * @param {number} raffle_id
   * @returns {Promise<Object>}
   * @throws {AppError} If no eligible tickets exist.
   * @private
   */
  async #selectRandomTicket(raffle_id) {
    const reserved = await this.ticketRepository.getReservedTickets(raffle_id);
    if (!reserved.length) {
      throw new AppError('No eligible tickets found', 400);
    }
    return reserved[Math.floor(Math.random() * reserved.length)];
  }

  /**
   * Marks the raffle as inactive and updates audit info.
   * @param {number} raffle_id
   * @param {number} userSessionId
   * @returns {Promise<void>}
   * @private
   */
  async #closeRaffle(raffle_id, userSessionId) {
    await this.raffleService.update(
      raffle_id,
      {
        isActive: false,
        updatedBy: userSessionId,
      },
      { id: userSessionId },
    );
  }

  /**
   * Sends email notifications to participants and the winner.
   * @param {Object} raffle - The raffle object.
   * @param {number|string} ticketNumber - Winning ticket number.
   * @param {Object} winnerUser - Winner user object.
   * @param {Object} creatorUser - Organizer user object.
   * @private
   */
  #sendNotifications(raffle, ticketNumber, winnerUser, creatorUser) {
    this.winnerNotificationService.notifyParticipantsOfWinner(
      raffle,
      ticketNumber,
      creatorUser,
      winnerUser.id
    );

    this.winnerNotificationService.notifyWinnerUser(
      winnerUser,
      raffle,
      ticketNumber,
      creatorUser,
    );
  }
}

export default WinnerLogicService;
