import { Router } from 'express';
import { requireAuth, enforceOwnCompany } from '../middleware/auth.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.use(requireAuth, enforceOwnCompany);

router.get('/:company_id', getAnalytics);

export default router;
