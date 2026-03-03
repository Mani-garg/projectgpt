import { getAnalyticsByCompany } from '../models/analyticsModel.js';
import { getMaterialsByCompany } from '../models/materialModel.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const companyId = Number(req.params.company_id);

    if (!companyId) {
      return res.status(400).json({ error: 'Valid company_id is required' });
    }

    const analytics = await getAnalyticsByCompany(companyId);
    const profit = analytics.totalSales - analytics.totalCost;

    const materials = await getMaterialsByCompany(companyId);
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
