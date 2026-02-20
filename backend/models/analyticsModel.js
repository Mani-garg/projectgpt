import pool from '../config/db.js';

export const getAnalyticsByCompany = async (companyId) => {
  const [[salesAgg]] = await pool.query(
    'SELECT COALESCE(SUM(quantity * selling_price), 0) AS total_sales FROM sales WHERE company_id = ?',
    [companyId]
  );

  const [[productionAgg]] = await pool.query(
    'SELECT COALESCE(SUM(cost), 0) AS production_cost FROM production WHERE company_id = ?',
    [companyId]
  );

  const [[materialsAgg]] = await pool.query(
    'SELECT COALESCE(SUM(quantity * cost_per_unit), 0) AS material_cost FROM materials WHERE company_id = ?',
    [companyId]
  );

  const [dailySales] = await pool.query(
    `SELECT date, ROUND(SUM(quantity * selling_price),2) AS total
     FROM sales WHERE company_id = ? GROUP BY date ORDER BY date ASC`,
    [companyId]
  );

  const [dailyCost] = await pool.query(
    `SELECT date, ROUND(SUM(cost),2) AS total
     FROM production WHERE company_id = ? GROUP BY date ORDER BY date ASC`,
    [companyId]
  );

  return {
    totalSales: Number(salesAgg.total_sales),
    totalCost: Number(productionAgg.production_cost) + Number(materialsAgg.material_cost),
    productionCost: Number(productionAgg.production_cost),
    materialCost: Number(materialsAgg.material_cost),
    dailySales,
    dailyCost
  };
};
