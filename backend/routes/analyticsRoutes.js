import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/:company_id', getAnalytics);

export default router;
