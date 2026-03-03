# Textile ERP (Full Stack)

Production-ready modular Textile ERP web application with business insights.

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, React Router, Recharts
- **Backend**: Node.js, Express, MySQL, dotenv, bcrypt

---

## Project Structure

```bash
projectgpt/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js
  frontend/
    src/
      api/
      components/
      context/
      pages/
    index.html
```

---

## Database Schema (MySQL)

The backend auto-creates these tables at startup:

- `companies(id, name, email, password, logo_url)`
- `materials(id, company_id, name, quantity, cost_per_unit)`
- `production(id, company_id, product_name, quantity, cost, date)`
- `sales(id, company_id, buyer_name, location, quantity, selling_price, date)`

---

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

`.env` values:
- `PORT=5000`
- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=your_password`
- `DB_NAME=textile_erp`
- `DB_PORT=3306`
- `CLIENT_URL=http://localhost:5173`

---

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend defaults to backend on `http://localhost:5000`.

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Materials
- `POST /api/materials`
- `GET /api/materials/:company_id`

### Production
- `POST /api/production`
- `GET /api/production/:company_id`

### Sales
- `POST /api/sales`
- `GET /api/sales/:company_id`

### Analytics
- `GET /api/analytics/:company_id`

### Insights
- `POST /api/insights`

## Sample API Calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Textile One","email":"owner@textile.com","password":"StrongPass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@textile.com","password":"StrongPass123"}'
```

### Add Material
```bash
curl -X POST http://localhost:5000/api/materials \
  -H "Content-Type: application/json" \
  -d '{"company_id":1,"name":"Cotton Yarn","quantity":200,"cost_per_unit":15.75}'
```

### Business Insights
```bash
curl -X POST http://localhost:5000/api/insights \
  -H "Content-Type: application/json" \
  -d '{"materials":[{"name":"Cotton Yarn","quantity":35}],"production":[{"product_name":"Shirt","quantity":120,"cost":3000}],"sales":[{"quantity":120,"selling_price":45}]}'
```

---

## Highlights
- Multi-company data isolation using `company_id` on each business table.
- Secure auth with bcrypt-hashed passwords.
- Business insight engine for profitability, stock warnings, and recommendations.
- Analytics dashboard with KPI cards and daily charts.
- Low-stock alerts integrated in analytics.

