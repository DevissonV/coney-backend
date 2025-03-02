/**
 * Service class for handling payments business logic.
 * @class PaymentService
 */
class PaymentService {
    /** @private */
    #channelService;
    
    /**
     * inject instance of ChannelService.
     *
     * @param {Object} channelService -
     */
    constructor(channelService) {
        /**
         * @private
         * @type {Object}
         */
        this.#channelService = channelService;
    }
    /**
     * Publishes a payment notification.
     * @param {number} id - The payment identifier.
     * @returns {Promise<void>}
     */
    async publishPaymentNotification(id) {
        return this.#channelService.publishPaymentNotification(id);
    }
}

export default PaymentService;