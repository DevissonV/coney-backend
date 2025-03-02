import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';

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
            .publishPaymentNotification(req.params.id)
            .then((newUser) =>
                responseHandler.success(
                    res,
                    newUser,
                    getSuccessMessage('CREATE', 'User'),
                    201,
                ),
            )
            .catch(next);
    }
}
export default PaymentController;