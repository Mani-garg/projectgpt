import { Router } from 'express';
import { createProduction, listProduction } from '../controllers/productionController.js';

const router = Router();

router.post('/', createProduction);
router.get('/:company_id', listProduction);

export default router;
