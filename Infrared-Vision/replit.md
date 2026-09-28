# IrisMap

IrisMap is an interactive remote-sensing workspace for exploring satellite imagery, applying infrared composites, and reviewing AI-assisted scene observations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional service secrets are listed in `.env.example`; missing optional integrations must not block map use.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ir-colorizer/src/pages/Home.tsx` — map workspace and scene-analysis UI
- `artifacts/api-server/src/routes/` — API route handlers
- `artifacts/api-server/src/mcp/` — safe Railway/Cloudflare diagnostic adapters
- `artifacts/api-server/src/services/agentPhone.ts` — isolated alert provider adapter
- `lib/api-spec/openapi.yaml` — source of truth for generated API contracts
- `.env.example` — variable names only; credentials belong in Replit Secrets

## Architecture decisions

- Scene analysis accepts a captured viewport image when available and falls back to a provider tile when capture is unavailable.
- Optional infrastructure and telephony providers report safe configuration state instead of fabricating undocumented API calls.
- Automatic alert dispatch remains disabled unless explicitly enabled by configuration; the UI only exposes manual test dispatch.

## Product

Users can search and navigate satellite scenes, switch infrared composites, review AI scene analysis, inspect integration diagnostics, and manually test alert delivery without exposing provider credentials.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
