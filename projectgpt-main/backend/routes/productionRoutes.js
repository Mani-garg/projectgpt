import { Router } from 'express';
import { requireAuth, enforceOwnCompany } from '../middleware/auth.js';
import { createProduction, listProduction, removeProduction, updateProduction } from '../controllers/productionController.js';

const router = Router();

router.use(requireAuth, enforceOwnCompany);

router.post('/', createProduction);
router.get('/:company_id', listProduction);
router.put('/:id', updateProduction);
router.delete('/:id', removeProduction);

export default router;
