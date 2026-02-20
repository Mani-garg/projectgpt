import { addMaterial, getMaterialsByCompany } from '../models/materialModel.js';

export const createMaterial = async (req, res, next) => {
  try {
    const { company_id, name, quantity, cost_per_unit } = req.body;

    if (!company_id || !name || quantity == null || cost_per_unit == null) {
      res.status(400);
      throw new Error('company_id, name, quantity, and cost_per_unit are required');
    }

    const id = await addMaterial({ company_id, name, quantity, cost_per_unit });
    return res.status(201).json({ message: 'Material added', id });
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
