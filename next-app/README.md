# Magic Next App (minimal)

Minimal Next.js + TypeScript app that reads PostgreSQL and exposes three API endpoints and a simple UI.

Setup

1. Copy `.env.local.example` to `.env.local` and set `DATABASE_URL`.
2. Install deps: `npm install`.
3. Run dev: `npm run dev`.

API routes

- `GET /api/checklist`
- `GET /api/statusinvest/latest`
- `GET /api/statusinvest/i10_ranking`

Each accepts query params: `page`, `pageSize`, `q`, `sort`.

Deploy

Deploy to Vercel. Set the `DATABASE_URL` environment variable in Vercel Dashboard.

Note: This is minimal example. Ensure you run `npm install` inside `next-app` and set `DATABASE_URL`.
