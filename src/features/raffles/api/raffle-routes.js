import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import raffleController from '../controllers/raffle-controller.js';

const router = Router();

router.get(
  '/', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  raffleController.getAll
);
router.get(
  '/:id', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  raffleController.getById
);
router.post(
  '/', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  raffleController.create
);
router.patch(
  '/:id', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  raffleController.update
);
router.delete(
  '/:id', authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  raffleController.delete
);

export default router;