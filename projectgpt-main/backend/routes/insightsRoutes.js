import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getBusinessInsights } from '../controllers/insightsController.js';

const router = Router();

router.post('/', requireAuth, getBusinessInsights);

export default router;
