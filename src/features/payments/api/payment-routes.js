import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import { container } from '../services/payment-container.js';

const paymentController = container.paymentController;

const router = Router();

router.post(
    '/:id',
    authenticate,
    authorize([envs.ROLE_ADMIN]),
    // paymentController.buy
    paymentController.buy.bind(paymentController)
);

export default router;