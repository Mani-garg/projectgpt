import pool from '../config/db.js';

export const addMaterial = async ({ company_id, name, quantity, cost_per_unit, unit = 'kg' }) => {
  const [result] = await pool.query(
    'INSERT INTO materials (company_id, name, quantity, unit, cost_per_unit) VALUES (?, ?, ?, ?, ?)',
    [company_id, name, quantity, unit, cost_per_unit]
  );
  return result.insertId;
};

export const getMaterialsByCompany = async (companyId) => {
  const [rows] = await pool.query(
    'SELECT id, company_id, name, quantity, unit, cost_per_unit, created_at FROM materials WHERE company_id = ? ORDER BY created_at DESC',
    [companyId]
  );
  return rows;
};
