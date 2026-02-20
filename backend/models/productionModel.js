import pool from '../config/db.js';

export const addProduction = async ({ company_id, product_name, quantity, cost, date }) => {
  const [result] = await pool.query(
    'INSERT INTO production (company_id, product_name, quantity, cost, date) VALUES (?, ?, ?, ?, ?)',
    [company_id, product_name, quantity, cost, date]
  );
  return result.insertId;
};

export const getProductionByCompany = async (companyId) => {
  const [rows] = await pool.query(
    'SELECT id, company_id, product_name, quantity, cost, date FROM production WHERE company_id = ? ORDER BY date DESC',
    [companyId]
  );
  return rows;
};
