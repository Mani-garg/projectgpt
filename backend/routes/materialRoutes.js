import { Router } from 'express';
import { createMaterial, listMaterials } from '../controllers/materialController.js';

const router = Router();

router.post('/', createMaterial);
router.get('/:company_id', listMaterials);

export default router;
