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
