import OpenAI from 'openai';
import { updateCompanyLogo } from '../models/companyModel.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateLogo = async (req, res, next) => {
  try {
    const { company_id, company_name, style } = req.body;
    if (!company_id || !company_name || !style) {
      res.status(400);
      throw new Error('company_id, company_name, and style are required');
    }

    const prompt = `Create a clean textile company logo for ${company_name} in ${style} style. Keep it minimal and modern.`;

    const response = await client.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024'
    });

    const image = response.data?.[0];
    const logoUrl = image?.url || (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : null);

    if (!logoUrl) {
      res.status(500);
      throw new Error('Unable to generate logo');
    }

    await updateCompanyLogo(company_id, logoUrl);
    return res.json({ message: 'Logo generated', logo_url: logoUrl });
  } catch (error) {
    return next(error);
  }
};

export const getBusinessInsights = async (req, res, next) => {
  try {
    const { materials, production, sales } = req.body;

    if (!materials || !production || !sales) {
      res.status(400);
      throw new Error('materials, production, and sales data are required');
    }

    const prompt = `You are a textile ERP advisor. Analyze the following data and provide:\n1) Profit insights\n2) Stock warnings\n3) Actionable suggestions\n\nMaterials: ${JSON.stringify(materials)}\nProduction: ${JSON.stringify(production)}\nSales: ${JSON.stringify(sales)}`;

    const completion = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt
    });

    const text = completion.output_text || 'No insights generated.';
    return res.json({ insights: text });
  } catch (error) {
    return next(error);
  }
};
