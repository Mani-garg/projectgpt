import { getAnalyticsByCompany } from '../models/analyticsModel.js';
import { getMaterialsByCompany } from '../models/materialModel.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const analytics = await getAnalyticsByCompany(company_id);
    const profit = analytics.totalSales - analytics.totalCost;

    const materials = await getMaterialsByCompany(company_id);
    const lowStock = materials.filter((item) => Number(item.quantity) < 50);

    return res.json({
      ...analytics,
      profit,
      lowStock
    });
  } catch (error) {
    return next(error);
  }
};
