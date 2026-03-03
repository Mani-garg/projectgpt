import { Router } from 'express';
import { getBusinessInsights } from '../controllers/insightsController.js';

const router = Router();

router.post('/', getBusinessInsights);

export default router;
