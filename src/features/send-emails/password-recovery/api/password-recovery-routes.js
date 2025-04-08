import { Router } from 'express';
import passwordRecoveryController from '../controllers/password-recovery-controller.js';

const router = Router();

router.post('/', passwordRecoveryController.requestRecovery);
router.post('/reset', passwordRecoveryController.resetPassword);

export default router;
