import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import userService from '#features/users/services/user-service.js';

/**
 * Controller for managing users.
 * @class UserController
 */
class PaymentController {
  /** @private */
  #paymentService;

  /**
   * inject instance of PaymentService.
   *
   * @param {Object} paymentService -
   */
  constructor(paymentService) {
    /**
     * @private
     * @type {Object}
     */
    this.#paymentService = paymentService;
  }

  /**
   * Publish a ticket buy notification.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  // buy = async (req, res, next) => {
  async buy(req, res, next) {
    await this.#paymentService
      .publishPaymentNotification(req.body)
      .then((newPayment) =>
        responseHandler.success(
          res,
          newPayment,
          getSuccessMessage('CREATE', 'Payment'),
          201,
        ),
      )
      .catch(next);
  }

  async createPaymentSession(req, res, next) {
    await this.#paymentService
      .createPaymentSession(req.body)
      .then((session) =>
        responseHandler.success(
          res,
          session,
          getSuccessMessage('CREATED', 'Payment'),
          201,
        ),
      )
      .catch(next);
  }

  /**
   * Gives an update from Stripe about payment.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   */
  async webhook(req, res, next) {
    this.#paymentService
      .webhookService()
      .then(() =>
        responseHandler.success(
          res,
          {},
          getSuccessMessage('GET_ONE', 'Payment'),
        ),
      )
      .catch(next);
  }
}
export default PaymentController;
