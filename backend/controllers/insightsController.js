export const getBusinessInsights = async (req, res, next) => {
  try {
    const { materials, production, sales } = req.body;

    if (!materials || !production || !sales) {
      res.status(400);
      throw new Error('materials, production, and sales data are required');
    }

    const totalMaterialQty = materials.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalProductionQty = production.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalProductionCost = production.reduce((sum, item) => sum + Number(item.cost || 0), 0);
    const totalSalesRevenue = sales.reduce((sum, item) => {
      return sum + Number(item.quantity || 0) * Number(item.selling_price || 0);
    }, 0);

    const estimatedProfit = totalSalesRevenue - totalProductionCost;
    const lowStock = materials.filter((item) => Number(item.quantity || 0) < 50).map((item) => item.name);

    const insights = [
      `Estimated Revenue: ₹${totalSalesRevenue.toFixed(2)}`,
      `Estimated Production Cost: ₹${totalProductionCost.toFixed(2)}`,
      `Estimated Profit/Loss: ₹${estimatedProfit.toFixed(2)}`,
      `Total Material Units in Stock: ${totalMaterialQty}`,
      `Total Produced Units: ${totalProductionQty}`,
      lowStock.length
        ? `Low Stock Warning: ${lowStock.join(', ')}`
        : 'Low Stock Warning: None',
      estimatedProfit < 0
        ? 'Suggestion: Reduce production cost or improve pricing to avoid losses.'
        : 'Suggestion: Keep current pricing and monitor low-stock materials regularly.'
    ].join('\n');

    return res.json({ insights });
  } catch (error) {
    return next(error);
  }
};
