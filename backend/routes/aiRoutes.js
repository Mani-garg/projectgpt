import { Router } from 'express';
import { generateLogo, getBusinessInsights } from '../controllers/aiController.js';

const router = Router();

router.post('/logo', generateLogo);
router.post('/insights', getBusinessInsights);

export default router;
