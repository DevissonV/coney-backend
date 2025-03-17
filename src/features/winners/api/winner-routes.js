import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import winnerController from '../controllers/winner-controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  winnerController.getAll,
);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  winnerController.getById,
);
router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  winnerController.create,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  winnerController.delete,
);

export default router;
