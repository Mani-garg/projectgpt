# Textile ERP — Full-Stack Web Application

A modular ERP application built for textile businesses to manage inventory, production, sales, and business performance in one dashboard.

- **Problem solved:** Small manufacturers often track material, production, and sales data in separate tools.
- **Solution:** A single full-stack system with CRUD workflows, analytics, CSV import/export, and AI-generated business insights.
- **Role-ready strengths demonstrated:** REST API design, relational data modeling, dashboard UX, modular React architecture, Express + MySQL integration, and serverless deployment.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts
- **Backend:** Node.js, Express, MySQL2, bcrypt
- **AI:** OpenAI API for generated business insights (falls back to rule-based summary if no key is set)
- **Deployment:** Single Vercel project (static frontend + serverless API)

## Core Features
- Company registration and login with hashed passwords (bcrypt) and JWT-based sessions.
- Material, production, and sales management (full CRUD), scoped to the authenticated company only.
- CSV import/export for bulk data entry.
- KPI dashboard, daily sales/cost trend charts, low-stock alerts.
- AI-generated business insights (revenue, profit, and actionable recommendations).
- Multi-tenant data separation via `company_id` across all business tables.

## System Architecture

```text
React UI (frontend, static build)
   ↓ HTTP (same-origin /api/* in production)
Express API (backend, runs as a Vercel serverless function)
   ↓
MySQL-compatible database (cloud-hosted)
```

## Project Structure

```bash
projectgpt/
  api/
    index.js         # Vercel serverless entrypoint (wraps backend/app.js)
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js         # used for local dev only (node server.js)
  frontend/
    src/
      api/
      components/
      context/
      pages/
  vercel.json
  package.json         # root deps used by the /api serverless function
```

## Database Tables (Auto-Initialized)
The backend initializes required tables at startup:
- `companies(id, name, email, password, logo_url)`
- `materials(id, company_id, name, quantity, unit, cost_per_unit)`
- `production(id, company_id, product_name, quantity, cost, date)`
- `sales(id, company_id, buyer_name, location, quantity, selling_price, date)`

---

## Authentication & Authorization

- Login returns a signed **JWT** (7-day expiry) containing the company's id. The frontend stores it and sends it as `Authorization: Bearer <token>` on every request.
- Every data route (`/api/materials`, `/api/production`, `/api/sales`, `/api/analytics`, `/api/insights`) is protected by an `requireAuth` middleware that rejects requests with a missing/invalid/expired token.
- An `enforceOwnCompany` middleware checks that any `company_id` in the request matches the company encoded in the token, and overwrites the request body's `company_id` with the token's value — so one company can never read or write another company's data, even by guessing or tampering with an id.
- Passwords are hashed with bcrypt before storage; the plaintext password is never stored or returned.

---

## Security note

An earlier version of this repo had a `backend/.env` file committed with a real database password and OpenAI API key. That file has been removed and replaced with `backend/.env.example`. **If you already pushed that `.env` to GitHub, treat the old OpenAI key and DB password as compromised — rotate/regenerate both before deploying.** `.gitignore` now excludes `.env` files so this doesn't happen again.

---

## Local Setup

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your local DB credentials
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

---

## Deploying to Vercel (frontend + backend together)

This repo is set up to deploy as **one Vercel project**: the React app is served as a static build, and the Express API runs as a single serverless function at `/api/*`. No separate backend hosting needed.

### 1) Get a cloud MySQL database
Vercel's serverless functions can't use a local MySQL server, so you need a cloud-hosted MySQL-compatible database. Free options that work well for a portfolio project:
- **TiDB Cloud Serverless** (MySQL-compatible, generous free tier)
- **Aiven for MySQL** (free trial)
- **Railway MySQL**

Once created, note the host, port, username, password, and database name. Most cloud providers require SSL — keep that in mind for step 3.

### 2) Push this repo to GitHub
Make sure `.env` is **not** committed (it's in `.gitignore` already).

### 3) Import the project in Vercel
1. Go to vercel.com → **New Project** → import your GitHub repo.
2. Vercel will detect `vercel.json` automatically — no need to change build settings.
3. Add these **Environment Variables** in the Vercel project settings:

| Variable | Value |
|---|---|
| `DB_HOST` | your cloud DB host |
| `DB_USER` | your cloud DB user |
| `DB_PASSWORD` | your cloud DB password |
| `DB_NAME` | your database name |
| `DB_PORT` | usually `3306` (or `4000` for TiDB Cloud) |
| `DB_SSL` | `true` (most cloud providers require this) |
| `JWT_SECRET` | a long random string, e.g. output of `openssl rand -hex 32` |
| `OPENAI_API_KEY` | your OpenAI key (optional — insights fall back to a rule-based summary if omitted) |
| `CLIENT_URL` | your deployed URL, e.g. `https://your-project.vercel.app` |

4. Click **Deploy**. Vercel builds the frontend (`frontend/dist`) and deploys `api/index.js` as a serverless function in the same deployment.
5. Visit your `.vercel.app` URL — register a company and you're live.

That's it — one project, one URL, frontend and backend deployed together.

---

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

### Insights (AI-powered, with rule-based fallback)
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
