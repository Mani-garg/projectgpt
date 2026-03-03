import { addProduction, deleteProductionById, getProductionByCompany, updateProductionById } from '../models/productionModel.js';

export const createProduction = async (req, res, next) => {
  try {
    const { company_id, product_name, quantity, cost, date } = req.body;

    if (!company_id || !product_name || quantity == null || cost == null || !date) {
      res.status(400);
      throw new Error('company_id, product_name, quantity, cost, and date are required');
    }

    const id = await addProduction({ company_id, product_name, quantity, cost, date });
    return res.status(201).json({ message: 'Production entry added', id });
  } catch (error) {
    return next(error);
  }
};

export const updateProduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_id, product_name, quantity, cost, date } = req.body;

    if (!company_id || !product_name || quantity == null || cost == null || !date) {
      res.status(400);
      throw new Error('company_id, product_name, quantity, cost, and date are required');
    }

    const updated = await updateProductionById({ id, company_id, product_name, quantity, cost, date });
    if (!updated) {
      res.status(404);
      throw new Error('Production entry not found');
    }

    return res.json({ message: 'Production entry updated' });
  } catch (error) {
    return next(error);
  }
};

export const removeProduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company_id = req.query.company_id;

    if (!company_id) {
      res.status(400);
      throw new Error('company_id is required');
    }

    const deleted = await deleteProductionById({ id, company_id });
    if (!deleted) {
      res.status(404);
      throw new Error('Production entry not found');
    }

    return res.json({ message: 'Production entry deleted' });
  } catch (error) {
    return next(error);
  }
};

export const listProduction = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const production = await getProductionByCompany(company_id);
    return res.json({ production });
  } catch (error) {
    return next(error);
  }
};
