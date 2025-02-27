import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import userController from '../controllers/user-controller.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  userController.delete,
);

export default router;
