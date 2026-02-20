import { addSale, getSalesByCompany } from '../models/salesModel.js';

export const createSale = async (req, res, next) => {
  try {
    const { company_id, buyer_name, location, quantity, selling_price, date } = req.body;

    if (!company_id || !buyer_name || !location || quantity == null || selling_price == null || !date) {
      res.status(400);
      throw new Error('company_id, buyer_name, location, quantity, selling_price, and date are required');
    }

    const id = await addSale({ company_id, buyer_name, location, quantity, selling_price, date });
    return res.status(201).json({ message: 'Sale entry added', id });
  } catch (error) {
    return next(error);
  }
};

export const listSales = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const sales = await getSalesByCompany(company_id);
    return res.json({ sales });
  } catch (error) {
    return next(error);
  }
};
