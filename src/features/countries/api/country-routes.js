import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import countryController from '../controllers/country-controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  countryController.getAll,
);
router.get(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  countryController.getById,
);
router.post(
  '/',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  countryController.create,
);
router.patch(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  countryController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([envs.ROLE_ADMIN]),
  countryController.delete,
);

export default router;
