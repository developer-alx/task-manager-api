# research.md

## Decisions for User Profile Management

Decision: Use existing `authMiddleware` + JWT for route protection.
Rationale: The repo already exposes `authMiddleware` and JWT usage patterns in controllers; reusing it keeps consistency and reduces risk.

Decision: Never return `password` or other sensitive fields; services will strip them before returning.
Rationale: Security principle and aligns with project constitution.

Decision: Use `zod` for input validation in services/controllers.
Rationale: `zod` is already listed as a dependency and provides runtime validation suitable for TypeScript projects.

Decision: Implement repository methods on `src/repositories/UserRepository.ts`: `findAll()`, `findById(id)`, `update(id, data)`, `delete(id)`.
Rationale: Keeps DB access centralized and aligns with architecture.

Alternatives considered:
- Add `GET /users/me` endpoint — deferred as convenience (can be implemented using `GET /users/:id` with authenticated id).
- Implement RBAC with a full roles subsystem — deferred; start with `role: 'admin'` guard and document expansion path.

Open questions (NEEDS CLARIFICATION):
- Performance SLAs / expected scale (affects pagination/caching strategies).
- Whether `delete` should be soft-delete (archive) or hard-delete.
