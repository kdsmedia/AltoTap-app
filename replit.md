# AltoTap

A mobile app (Expo React Native) with an Express API backend, organized as a pnpm monorepo.

## Project structure

| Path | Description |
|---|---|
| `artifacts/mobile/` | Expo React Native app (AltoTap) — login, spin, stats, topup/withdraw, transactions screens |
| `artifacts/api-server/` | Express + TypeScript API server |
| `lib/db/` | Drizzle ORM schema + PostgreSQL client (shared) |
| `lib/api-zod/` | Shared Zod validation schemas |
| `lib/api-spec/` | Shared API spec |
| `lib/api-client-react/` | React Query API client (used by mobile) |

## Running the project

Both workflows are pre-configured and start automatically:

- **Expo Mobile** — starts Metro bundler on port 18115. Scan the QR code with Expo Go or open on web.
- **API Server** — starts the Express server on port 8080.

To install dependencies: `pnpm install` from the project root.

## Database

Uses Replit's built-in PostgreSQL. `DATABASE_URL` is injected automatically at runtime — no manual setup needed. Schema is defined in `lib/db/src/schema/` using Drizzle ORM.

## User preferences

_None recorded yet._
