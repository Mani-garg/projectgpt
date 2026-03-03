import pool from '../config/db.js';

export const addSale = async ({ company_id, buyer_name, location, quantity, selling_price, date }) => {
  const [result] = await pool.query(
    'INSERT INTO sales (company_id, buyer_name, location, quantity, selling_price, date) VALUES (?, ?, ?, ?, ?, ?)',
    [company_id, buyer_name, location, quantity, selling_price, date]
  );
  return result.insertId;
};

export const getSalesByCompany = async (companyId) => {
  const [rows] = await pool.query(
    'SELECT id, company_id, buyer_name, location, quantity, selling_price, date FROM sales WHERE company_id = ? ORDER BY date DESC',
    [companyId]
  );
  return rows;
};

export const updateSaleById = async ({ id, company_id, buyer_name, location, quantity, selling_price, date }) => {
  const [result] = await pool.query(
    'UPDATE sales SET buyer_name = ?, location = ?, quantity = ?, selling_price = ?, date = ? WHERE id = ? AND company_id = ?',
    [buyer_name, location, quantity, selling_price, date, id, company_id]
  );
  return result.affectedRows;
};

export const deleteSaleById = async ({ id, company_id }) => {
  const [result] = await pool.query('DELETE FROM sales WHERE id = ? AND company_id = ?', [id, company_id]);
  return result.affectedRows;
};
