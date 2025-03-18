import { createPaymentSessionDto } from '#features/payments/dto/payment-session-dto.js';

/**
 * Service class for handling payments business logic.
 * @class PaymentService
 */
class PaymentService {
  /** @private */
  #channelService;
  #stripeService;
  /**
   * inject instance of ChannelService.
   *
   * @param {Object} channelService
   * @param stripeService
   */
  constructor(channelService, stripeService) {
    /**
     * @private
     * @type {Object}
     */
    this.#channelService = channelService;
    this.#stripeService = stripeService;
  }
  /**
   * Publishes a payment notification.
   * @param {number} id - The payment identifier.
   * @returns {Promise<void>}
   */
  async publishPaymentNotification(id) {
    return this.#channelService.publishPaymentNotification(id);
  }

  async createPaymentSession(payment) {
    const dto = createPaymentSessionDto(payment);
    const session = await this.#stripeService.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },
      line_items: [
        {
          price_data: {
            currency: dto.currency,
            product_data: { name: 'Ticket' },
            unit_amount: dto.amount,
          },
          quantity: dto.tickets.length,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5000/api/payments/success', // llevar a una var de env
      cancel_url: 'http://localhost:5000/api/payments/cancel',
    });
    console.log('session', session);
    return {
      status: 'success',
      sessionId: session.id,
      info: session,
    };
  }

  async webhookService() {
    return 'webhook successful called.';
  }
}

export default PaymentService;
