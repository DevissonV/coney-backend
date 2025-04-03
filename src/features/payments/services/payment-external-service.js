import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { envs } from '#core/config/envs.js';
import { validatePaymentSession } from '#features/payments/validations/payment-session-validation.js';

class PaymentExternalService {
  /** @private */
  #stripeService;

  /**
   * Crea una instancia de PaymentExternalService.
   * @param {Object} stripeService - Instancia de Stripe (u otro proveedor).
   */
  constructor(stripeService) {
    this.#stripeService = stripeService;
  }

  /**
   * Crea una sesión de pago en el proveedor externo (por ejemplo, Stripe).
   * @param {Object} payment - Datos del pago.
   * @returns {Promise<string>} El ID de la sesión creada.
   * @throws {AppError} Si ocurre algún error al crear la sesión.
   */
  async createSession(payment) {
    const validData = validatePaymentSession(payment);
    try {
      const session = await this.#stripeService.checkout.sessions.create({
        payment_intent_data: { metadata: {} },
        line_items: [
          {
            price_data: {
              currency: validData.currency || 'COP',
              product_data: { name: 'Ticket' },
              unit_amount: validData.amount * 100,
            },
            quantity: validData.tickets.length,
          },
        ],
        mode: 'payment',
        cancel_url: envs.STRIPE_CANCEL_URL,
        success_url: envs.STRIPE_SUCCESS_URL,
      });

      getLogger().info('External payment session created: ' + session.id);

      return {
        sessionId: session.id,
        sessionUrl: session.url,
      };
    } catch (error) {
      getLogger().error(
        'Error creating external payment session: ' + error.message,
      );
      throw new AppError('Error creating payment session', 500);
    }
  }
}

export default PaymentExternalService;
