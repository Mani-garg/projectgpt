import { Router } from 'express';
import { requireAuth, enforceOwnCompany } from '../middleware/auth.js';
import { createSale, listSales, removeSale, updateSale } from '../controllers/salesController.js';

const router = Router();

router.use(requireAuth, enforceOwnCompany);

router.post('/', createSale);
router.get('/:company_id', listSales);
router.put('/:id', updateSale);
router.delete('/:id', removeSale);

export default router;
