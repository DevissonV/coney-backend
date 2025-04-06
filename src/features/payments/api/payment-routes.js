import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import paymentController from '../controllers/payment-controller.js';

const router = Router();

router.get('/success', paymentController.success);
router.get('/cancel', paymentController.cancel);
router.get(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  paymentController.getAll,
);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  paymentController.getById,
);
router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  paymentController.create,
);
router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  paymentController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  paymentController.delete,
);

export default router;
