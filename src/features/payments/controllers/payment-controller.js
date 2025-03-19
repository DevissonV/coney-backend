import BaseController from '#core/base/base-controller.js';
import paymentService from '../services/payment-service.js';
import { responseHandler } from '#core/utils/response/response-handler.js';

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
  }

  success(_, res) {
    responseHandler.success(res, {}, 'Payment successfully', 200);
  }

  cancel(_, res) {
    responseHandler.success(res, {}, 'Payment cancelled', 200);
  }
}

export default new PaymentController();
