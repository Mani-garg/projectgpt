# Textile ERP (Full-Stack Web Application)

A modular ERP application built for textile businesses to manage inventory, production, sales, and business performance in one dashboard.


- **Problem solved:** Small manufacturers often track material, production, and sales data in separate tools.
- **Solution:** A single full-stack system with CRUD workflows, analytics, and generated business insights.
- **Role-ready strengths demonstrated:** API design, relational data modeling, dashboard UX, modular React architecture, and Express + MySQL integration.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts
- **Backend:** Node.js, Express, MySQL2, dotenv, bcrypt

## Core Features
- Company registration and login with hashed passwords.
- Material, production, and sales management (create, read, update, delete).
- KPI and trend analytics per company.
- Business insight endpoint for profitability and stock-level guidance.
- Multi-tenant data separation via `company_id` across business tables.

## System Architecture

```text
React UI (frontend)
   ↓ HTTP (REST)
Express API (backend)
   ↓
MySQL database
```

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
```

## Database Tables (Auto-Initialized)
The backend initializes required tables at startup:
- `companies(id, name, email, password, logo_url)`
- `materials(id, company_id, name, quantity, cost_per_unit)`
- `production(id, company_id, product_name, quantity, cost, date)`
- `sales(id, company_id, buyer_name, location, quantity, selling_price, date)`

## Local Setup

### 1) Backend
```bash
cd backend
npm install
```

Run backend:
```bash
node server.js
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Optional `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Health
- `GET /health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Materials
- `POST /api/materials`
- `GET /api/materials/:company_id`
- `PUT /api/materials/:id`
- `DELETE /api/materials/:id`

### Production
- `POST /api/production`
- `GET /api/production/:company_id`
- `PUT /api/production/:id`
- `DELETE /api/production/:id`

### Sales
- `POST /api/sales`
- `GET /api/sales/:company_id`
- `PUT /api/sales/:id`
- `DELETE /api/sales/:id`

### Analytics
- `GET /api/analytics/:company_id`

### Insights
- `POST /api/insights`

## Example API Calls

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

### Request Business Insights
```bash
curl -X POST http://localhost:5000/api/insights \
  -H "Content-Type: application/json" \
  -d '{"materials":[{"name":"Cotton Yarn","quantity":35}],"production":[{"product_name":"Shirt","quantity":120,"cost":3000}],"sales":[{"quantity":120,"selling_price":45}]}'
```

