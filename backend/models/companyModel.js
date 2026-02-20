import pool from '../config/db.js';

export const createCompany = async ({ name, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO companies (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result.insertId;
};

export const findCompanyByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM companies WHERE email = ?', [email]);
  return rows[0];
};

export const updateCompanyLogo = async (companyId, logoUrl) => {
  await pool.query('UPDATE companies SET logo_url = ? WHERE id = ?', [logoUrl, companyId]);
};

export const findCompanyById = async (companyId) => {
  const [rows] = await pool.query('SELECT id, name, email, logo_url FROM companies WHERE id = ?', [companyId]);
  return rows[0];
};
