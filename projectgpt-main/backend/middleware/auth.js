import jwt from 'jsonwebtoken';

// Verifies the Bearer token sent by the frontend and attaches the
// authenticated company's id to req.auth. Every protected route runs this
// first, so no request reaches a controller without a valid, unexpired token.
export const requireAuth = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET is not set' });
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { companyId: Number(payload.companyId) };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Prevents an authenticated company from reading or writing another
// company's data. Any company_id present in the request (route param, query
// string, or body) must match the company encoded in the JWT. Body values
// are also overwritten with the token's company id so a client can never
// spoof a different company_id on create/update calls.
export const enforceOwnCompany = (req, res, next) => {
  const candidateId = req.body?.company_id ?? req.params?.company_id ?? req.query?.company_id;

  if (candidateId !== undefined && Number(candidateId) !== req.auth.companyId) {
    return res.status(403).json({ message: "Not authorized to access this company's data" });
  }

  if (req.body && typeof req.body === 'object') {
    req.body.company_id = req.auth.companyId;
  }

  return next();
};
