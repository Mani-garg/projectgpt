import { addMaterial, deleteMaterialById, getMaterialsByCompany, updateMaterialById } from '../models/materialModel.js';

export const createMaterial = async (req, res, next) => {
  try {
    const { company_id, name, quantity, cost_per_unit, unit } = req.body;

    if (!company_id || !name || quantity == null || cost_per_unit == null) {
      res.status(400);
      throw new Error('company_id, name, quantity, and cost_per_unit are required');
    }

    const id = await addMaterial({ company_id, name, quantity, cost_per_unit, unit: unit || 'kg' });
    return res.status(201).json({ message: 'Material added', id });
  } catch (error) {
    return next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_id, name, quantity, cost_per_unit, unit } = req.body;

    if (!company_id || !name || quantity == null || cost_per_unit == null) {
      res.status(400);
      throw new Error('company_id, name, quantity, and cost_per_unit are required');
    }

    const updated = await updateMaterialById({ id, company_id, name, quantity, cost_per_unit, unit: unit || 'kg' });
    if (!updated) {
      res.status(404);
      throw new Error('Material not found');
    }

    return res.json({ message: 'Material updated' });
  } catch (error) {
    return next(error);
  }
};

export const removeMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company_id = req.query.company_id;

    if (!company_id) {
      res.status(400);
      throw new Error('company_id is required');
    }

    const deleted = await deleteMaterialById({ id, company_id });
    if (!deleted) {
      res.status(404);
      throw new Error('Material not found');
    }

    return res.json({ message: 'Material deleted' });
  } catch (error) {
    return next(error);
  }
};

export const listMaterials = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const materials = await getMaterialsByCompany(company_id);

    const lowStock = materials.filter((item) => Number(item.quantity) < 50);
    return res.json({ materials, lowStock });
  } catch (error) {
    return next(error);
  }
};
