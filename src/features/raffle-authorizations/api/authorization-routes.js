import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import authorizationController from '../controllers/authorization-controller.js';

const router = Router();
const upload = multer();

router.get(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.getAll,
);

router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.update,
);

router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.getById,
);

router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  authorizationController.delete,
);

router.post(
  '/:raffleId/documents',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  upload.single('file'),
  authorizationController.uploadDocument,
);

router.get(
  '/:authorizationId/documents',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.getDocuments,
);

router.delete(
  '/documents/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN, envs.ROLE_USER]),
  authorizationController.deleteDocument,
);

export default router;
