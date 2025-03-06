import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import ticketController from '../controllers/ticket-controller.js';

const router = Router();

router.get('/', ticketController.getAll);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  ticketController.getById,
);
router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  ticketController.create,
);
router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  ticketController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  ticketController.delete,
);

export default router;
