# AltoTap

A pnpm monorepo with an Expo mobile app and an Express API server.

## Structure

- `artifacts/mobile` — Expo (React Native) mobile app, served at `/`
- `artifacts/api-server` — Express + Drizzle ORM API server, served at `/api`
- `lib/db` — Drizzle schema and database client (uses Replit's managed PostgreSQL)
- `lib/api-spec` — OpenAPI spec
- `lib/api-zod` — Zod schemas generated from the API spec
- `lib/api-client-react` — React Query hooks generated from the API spec

## Running

Both services start automatically via their managed workflows:

- **API Server**: `artifacts/api-server: API Server` — builds and starts on port 8080
- **Mobile (Expo)**: `artifacts/mobile: expo` — starts Metro bundler on port 18115

## Environment

- `DATABASE_URL` — auto-injected by Replit (managed PostgreSQL)
- `SESSION_SECRET` — set as a Replit Secret

## Database

Uses Drizzle ORM with Replit's built-in PostgreSQL. Schema lives in `lib/db/src/schema/`. To push schema changes to dev: `pnpm --filter @workspace/db run push`.

## User preferences
