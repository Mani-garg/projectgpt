import bcrypt from 'bcrypt';
import { createCompany, findCompanyByEmail, findCompanyById } from '../models/companyModel.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('name, email, and password are required');
    }

    const existing = await findCompanyByEmail(email);
    if (existing) {
      res.status(409);
      throw new Error('Company with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const companyId = await createCompany({ name, email, password: hashedPassword });
    const company = await findCompanyById(companyId);

    return res.status(201).json({ message: 'Company registered successfully', company });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('email and password are required');
    }

    const company = await findCompanyByEmail(email);
    if (!company) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    return res.json({
      message: 'Login successful',
      company_id: company.id,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        logo_url: company.logo_url
      }
    });
  } catch (error) {
    return next(error);
  }
};
