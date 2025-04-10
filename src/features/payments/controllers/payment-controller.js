import BaseController from '#core/base/base-controller.js';
import paymentService from '../services/payment-service.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { PaymentCompletionService } from '../services/payment-completion-service.js';
import { PaymentValidationService } from '../services/payment-validation-service.js';

/**
 * Controller for managing payments.
 * Extends BaseController to inherit CRUD operations and adds custom actions
 * for external payment processing.
 *
 * @class PaymentController
 * @extends BaseController
 */
class PaymentController extends BaseController {
  constructor() {
    super(paymentService, 'Payment');
    this.success = this.success.bind(this);
    this.cancel = this.cancel.bind(this);
    this.markAsCompleted = this.markAsCompleted.bind(this);
  }

  success(_, res) {
    responseHandler.success(res, {}, 'Payment successfully', 200);
  }

  cancel(_, res) {
    responseHandler.success(res, {}, 'Payment cancelled', 200);
  }
  /**
   * Marks a payment as completed and updates all associated tickets as paid.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async markAsCompleted(req, res, next) {
    const { id } = req.params;
    PaymentCompletionService(Number(id))
      .then((data) =>
        responseHandler.success(
          res,
          data,
          'Payment marked as completed and tickets updated',
        ),
      )
      .catch(next);
  }

  /**
   * Validates expired pending payments and releases associated tickets.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async validateExpiredPayments(_, res, next) {
    PaymentValidationService()
      .then((result) =>
        responseHandler.success(
          res,
          result,
          'Expired pending payments validated successfully',
        ),
      )
      .catch(next);
  }
}

export default new PaymentController();
