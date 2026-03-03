import { Router } from 'express';
import { createSale, listSales, removeSale, updateSale } from '../controllers/salesController.js';

const router = Router();

router.post('/', createSale);
router.get('/:company_id', listSales);
router.put('/:id', updateSale);
router.delete('/:id', removeSale);

export default router;
