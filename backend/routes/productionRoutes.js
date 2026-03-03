import { Router } from 'express';
import { createProduction, listProduction, removeProduction, updateProduction } from '../controllers/productionController.js';

const router = Router();

router.post('/', createProduction);
router.get('/:company_id', listProduction);
router.put('/:id', updateProduction);
router.delete('/:id', removeProduction);

export default router;
