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

export const updateMaterialById = async ({ id, company_id, name, quantity, cost_per_unit, unit = 'kg' }) => {
  const [result] = await pool.query(
    'UPDATE materials SET name = ?, quantity = ?, unit = ?, cost_per_unit = ? WHERE id = ? AND company_id = ?',
    [name, quantity, unit, cost_per_unit, id, company_id]
  );
  return result.affectedRows;
};

export const deleteMaterialById = async ({ id, company_id }) => {
  const [result] = await pool.query('DELETE FROM materials WHERE id = ? AND company_id = ?', [id, company_id]);
  return result.affectedRows;
};
