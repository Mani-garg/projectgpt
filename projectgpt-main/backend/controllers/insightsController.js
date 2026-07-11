const computeMetrics = ({ materials, production, sales }) => {
  const totalMaterialQty = materials.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalProductionQty = production.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalProductionCost = production.reduce((sum, item) => sum + Number(item.cost || 0), 0);
  const totalSalesRevenue = sales.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.selling_price || 0),
    0
  );
  const estimatedProfit = totalSalesRevenue - totalProductionCost;
  const lowStock = materials.filter((item) => Number(item.quantity || 0) < 50).map((item) => item.name);

  return { totalMaterialQty, totalProductionQty, totalProductionCost, totalSalesRevenue, estimatedProfit, lowStock };
};

// Deterministic fallback used when no OPENAI_API_KEY is configured, or if the
// OpenAI call fails for any reason (network, quota, etc). Keeps the feature
// usable end-to-end even without an AI key set up.
const buildRuleBasedInsights = (metrics) => {
  const { totalSalesRevenue, totalProductionCost, estimatedProfit, totalMaterialQty, totalProductionQty, lowStock } = metrics;

  return [
    `Estimated Revenue: ₹${totalSalesRevenue.toFixed(2)}`,
    `Estimated Production Cost: ₹${totalProductionCost.toFixed(2)}`,
    `Estimated Profit/Loss: ₹${estimatedProfit.toFixed(2)}`,
    `Total Material Units in Stock: ${totalMaterialQty}`,
    `Total Produced Units: ${totalProductionQty}`,
    lowStock.length ? `Low Stock Warning: ${lowStock.join(', ')}` : 'Low Stock Warning: None',
    estimatedProfit < 0
      ? 'Suggestion: Reduce production cost or improve pricing to avoid losses.'
      : 'Suggestion: Keep current pricing and monitor low-stock materials regularly.'
  ].join('\n');
};

// Calls OpenAI's Chat Completions API to turn the raw business numbers into
// a short, readable narrative + recommendations. Falls back to rule-based
// insights if the API key is missing or the call fails.
const buildAIInsights = async (metrics, records) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a business analyst for a small textile manufacturing company.
Given this data, write a concise business insight report (max 150 words) with:
1) A one-line financial summary
2) 2-3 concrete, specific recommendations
3) Any inventory risk flags

Data:
- Total Sales Revenue: ₹${metrics.totalSalesRevenue.toFixed(2)}
- Total Production Cost: ₹${metrics.totalProductionCost.toFixed(2)}
- Estimated Profit/Loss: ₹${metrics.estimatedProfit.toFixed(2)}
- Total Material Units in Stock: ${metrics.totalMaterialQty}
- Total Produced Units: ${metrics.totalProductionQty}
- Low Stock Materials: ${metrics.lowStock.length ? metrics.lowStock.join(', ') : 'None'}
- Number of recent sales records: ${records.sales.length}
- Number of recent production records: ${records.production.length}

Respond in plain text, no markdown headers.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('OpenAI request failed:', response.status, errBody);
      return null;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (error) {
    console.error('OpenAI request errored:', error.message);
    return null;
  }
};

export const getBusinessInsights = async (req, res, next) => {
  try {
    const { materials, production, sales } = req.body;

    if (!materials || !production || !sales) {
      res.status(400);
      throw new Error('materials, production, and sales data are required');
    }

    const metrics = computeMetrics({ materials, production, sales });

    const aiInsights = await buildAIInsights(metrics, { materials, production, sales });
    const insights = aiInsights || buildRuleBasedInsights(metrics);

    return res.json({ insights, source: aiInsights ? 'ai' : 'rule-based' });
  } catch (error) {
    return next(error);
  }
};
