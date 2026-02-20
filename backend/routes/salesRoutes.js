import { Router } from 'express';
import { createSale, listSales } from '../controllers/salesController.js';

const router = Router();

router.post('/', createSale);
router.get('/:company_id', listSales);

export default router;
