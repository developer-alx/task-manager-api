# Task Manager API - Copilot Instructions

This repository is a TypeScript/Express backend API for task management using PostgreSQL and `node-pg-migrate`.

<!-- SPECKIT START -->
For additional context about the current feature plans and implementation guidance, see the plan:
specs/001-user-profile-management/plan.md
<!-- SPECKIT END -->

## Key patterns
- Follow the existing layered architecture: `routes` → `controllers` → `services` → `repositories`.
- Keep controllers thin; business rules belong in `src/services`.
- Database access belongs in `src/repositories` and `src/database/index.ts`.
- Use `src/shared/errors/AppError.ts` and `src/shared/errors/errorHandler.ts` for HTTP-friendly error handling.
- `src/app.ts` builds the Express application; `src/server.ts` starts the HTTP server.

## Important files and directories
- `src/routes/` — route definitions
- `src/controllers/` — request handling and response formatting
- `src/services/` — business logic
- `src/repositories/` — PostgreSQL data access
- `src/config/` — env, database, auth configuration
- `src/middlewares/` — auth and rate limit middleware
- `src/tests/` — Jest + Supertest integration tests
- `src/shared/docs/swagger.ts` — Swagger/OpenAPI setup

## Common commands
- `npm install`
- `npm run dev` — start development server with `ts-node-dev`
- `npm run build` — compile TypeScript to `dist`
- `npm test` — run Jest tests
- `npm run migrate:up` / `npm run migrate:down` — apply or revert DB migrations

## Notes for edits
- Preserve existing API behavior and authentication flows.
- Do not move business logic from services into controllers or routes.
- Keep configuration and environment handling in `src/config`.
- Respect the project's TypeScript/CommonJS setup.
- `.specify/` is used for agent/workflow integration; avoid changing it unless asked.

## Reference
- `README.md` for architecture and project goals.
