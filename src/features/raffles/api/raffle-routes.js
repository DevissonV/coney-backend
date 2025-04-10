import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import raffleController from '../controllers/raffle-controller.js';
import multer from 'multer';

const upload = multer();
const router = Router();

router.get('/', raffleController.getAll);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  raffleController.getById,
);
router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  raffleController.create,
);
router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  raffleController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  raffleController.delete,
);
router.post(
  '/:id/photo',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  upload.single('photo'),
  raffleController.uploadPhoto,
);

export default router;
