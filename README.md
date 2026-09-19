# EquityVault

**Source-backed corporate-action intelligence for Indian investors.**

EquityVault is a hackathon MVP combining Indian corporate actions, dividends, IPO intelligence, personal holdings, source documents, analytics, and a database-grounded AI assistant.

## MVP
- Real NSE corporate-action data
- Dividend tracking
- IPO Intelligence from official NSE issue information
- Portfolio holdings and expected-dividend calculation
- Source Documents with official links
- Analytics
- AI Vault grounded in EquityVault data
- React + Laravel premium dashboard

## Architecture
Official NSE / authorized source → Laravel ingestion → MySQL → Laravel REST API → React/Vite

## Stack
Frontend: React, Vite, React Router, Axios, Recharts, Lucide React, CSS  
Backend: Laravel 12, PHP 8.2+, REST API, MySQL, Eloquent

## Modules
Dashboard · Stocks · Dividends · Corporate Actions · Portfolio · IPO Intelligence · Analytics · Documents · AI Vault

## Data provenance
Records retain source exchange, source URL, source document metadata and fetch timestamps. Missing source information is not guessed.

## Current limitations
- Live market prices are not fabricated; unavailable values show `₹—`.
- Portfolio is stored in browser localStorage for the MVP.
- AI Vault is currently deterministic/database-grounded, not a general LLM.
- Some NSE CSV records do not contain payment dates, so payment dates are not guessed.

## Local setup

```powershell
cd backend
composer install
php artisan migrate
php artisan serve
```

```powershell
cd frontend
npm install
npm run dev
```

Backend: `http://127.0.0.1:8000`  
Frontend: `http://localhost:5173`

## API
- `GET /api/companies`
- `GET /api/companies/{id}`
- `GET /api/corporate-actions`
- `GET /api/ipos`
- `GET /api/ipos/{id}`
- `GET /api/documents`
- `POST /api/ai/ask`

## Demo flow
1. Dashboard
2. Stocks → TCS
3. Corporate actions
4. Portfolio → add shares → expected dividend
5. IPO Intelligence
6. Documents → official NSE source
7. AI Vault → expected dividend
8. Analytics

## Roadmap
Automated NSE/BSE ingestion, persistent authenticated portfolios, authorized live prices, alerts, document/PDF intelligence, grounded LLM research, deployment and observability.
