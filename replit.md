# AltoTap

A mobile tap-game app built with Expo (React Native) and an Express API server.

## Stack

- **Mobile** (`artifacts/mobile`): Expo Router, React Native, Google OAuth sign-in, tabs for Home / Tasks / Upgrades / Frens / Profile. Uses `@tanstack/react-query` for data fetching and AsyncStorage for local persistence.
- **API Server** (`artifacts/api-server`): Express 5, Drizzle ORM, PostgreSQL. Serves routes under `/api`.
- **Shared libs** (`lib/`):
  - `@workspace/db` — Drizzle schema + PostgreSQL pool
  - `@workspace/api-zod` — Zod schemas for API contracts
  - `@workspace/api-client-react` — typed fetch client for the mobile app
  - `@workspace/api-spec` — Orval config for API codegen

## Running locally on Replit

Both services start automatically via the artifact workflows:

| Service | Workflow | Port |
|---|---|---|
| Expo Mobile | `Expo Mobile` | 18115 |
| API Server | `API Server` | 8080 |

The API health check is available at `GET /api/healthz`.

## Database

Uses Replit's managed PostgreSQL. `DATABASE_URL` is injected automatically at runtime — no manual setup needed.

To apply schema changes: `cd lib/db && pnpm run push`

## Auth

Google OAuth (implicit flow) via `expo-web-browser`. Client ID is hardcoded in `artifacts/mobile/context/AuthContext.tsx`. Guest sign-in is also supported.

## User preferences

- Ikon menu navigasi harus terlihat jelas dan cukup besar; ikon Upgrade dibuat lebih besar daripada ikon lainnya.
