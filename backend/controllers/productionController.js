import { addProduction, getProductionByCompany } from '../models/productionModel.js';

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

export const listProduction = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const production = await getProductionByCompany(company_id);
    return res.json({ production });
  } catch (error) {
    return next(error);
  }
};
