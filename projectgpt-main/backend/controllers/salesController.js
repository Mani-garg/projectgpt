import { addSale, deleteSaleById, getSalesByCompany, updateSaleById } from '../models/salesModel.js';

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

export const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_id, buyer_name, location, quantity, selling_price, date } = req.body;

    if (!company_id || !buyer_name || !location || quantity == null || selling_price == null || !date) {
      res.status(400);
      throw new Error('company_id, buyer_name, location, quantity, selling_price, and date are required');
    }

    const updated = await updateSaleById({ id, company_id, buyer_name, location, quantity, selling_price, date });
    if (!updated) {
      res.status(404);
      throw new Error('Sale entry not found');
    }

    return res.json({ message: 'Sale entry updated' });
  } catch (error) {
    return next(error);
  }
};

export const removeSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company_id = req.query.company_id;

    if (!company_id) {
      res.status(400);
      throw new Error('company_id is required');
    }

    const deleted = await deleteSaleById({ id, company_id });
    if (!deleted) {
      res.status(404);
      throw new Error('Sale entry not found');
    }

    return res.json({ message: 'Sale entry deleted' });
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
