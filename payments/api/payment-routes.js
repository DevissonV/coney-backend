import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import { container } from '../services/payment-container.js';

const paymentController = container.paymentController;

const router = Router();

router.get(
    '/success',
    async (req, res, next) => {
        try {
            // Add your logic for creating a payment session here
            res.json({ message: 'Payment successfully' });
        } catch (error) {
            next(error);
        }
    }
);
router.get(
    '/cancel',
    async (req, res, next) => {
        try {
            // Add your logic for creating a payment session here
            res.json({ message: 'Payment cancelled' });
        } catch (error) {
            next(error);
        }
    }
);
router.post(
    '/create-payment-session',
    authenticate,
    authorize([envs.ROLE_ADMIN]),
    async (req, res, next) => {
        try {
            await paymentController.createPaymentSession(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/webhook',
    authenticate,
    authorize([envs.ROLE_ADMIN]),
    paymentController.webhook.bind(paymentController)
);


router.post(
    '/:id',
    authenticate,
    authorize([envs.ROLE_ADMIN]),
    paymentController.buy.bind(paymentController)
);

export default router;