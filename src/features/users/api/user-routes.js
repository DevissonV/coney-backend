import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import userController from '../controllers/user-controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  userController.getAll,
);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  userController.getById,
);
router.post('/', userController.create);
router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  userController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  userController.delete,
);
router.post('/login', userController.login);

export default router;
