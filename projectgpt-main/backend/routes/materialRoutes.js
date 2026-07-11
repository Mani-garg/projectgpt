import { Router } from 'express';
import { requireAuth, enforceOwnCompany } from '../middleware/auth.js';
import { createMaterial, listMaterials, removeMaterial, updateMaterial } from '../controllers/materialController.js';

const router = Router();

router.use(requireAuth, enforceOwnCompany);

router.post('/', createMaterial);
router.get('/:company_id', listMaterials);
router.put('/:id', updateMaterial);
router.delete('/:id', removeMaterial);

export default router;
