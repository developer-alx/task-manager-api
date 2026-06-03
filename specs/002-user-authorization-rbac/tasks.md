---
description: "Task list for User Authorization RBAC feature implementation in two incremental deliveries"
---

# Tasks: User Authorization RBAC

**Feature**: `002-user-authorization-rbac`
**Input**: spec.md, plan.md
**Strategy**: Two incremental deliveries - first establishes role data model and JWT payload; second activates authorization enforcement
**Tests**: Integration tests provided for RBAC acceptance criteria

---

## Phase 1: Setup (Database Schema)

**Purpose**: Prepare database to support role-based access control

- [ ] T001 Create migration to add `role` column to `users` table in `migrations/<timestamp>_add-role-to-users.js`
- [ ] T002 Apply migration with `npm run migrate:up` and verify column exists with default `'user'`

---

## Phase 2: Foundational — First Delivery (Role Data Model & JWT)

**Purpose**: Establish role persistence and JWT payload without activating access restrictions

**Checkpoint after this phase**: Users have role data (default `'user'`), JWT includes role in payload, system functions identically to before (all authenticated users can access all endpoints).

**When complete**: You will validate that system still works 100% as before, but now carries role data in JWT and database.

### Implementation

- [ ] T003 [P] Update `UserRepository` to include `role` in `SELECT` and `RETURNING` statements in `src/repositories/UserRepository.ts`
- [ ] T004 [P] Update `CreateUserService` to set default `role = 'user'` in `src/services/CreateUserService.ts` (do not allow `role` from API request body)
- [ ] T005 [P] Update `AuthService` to include `role` in JWT payload for both `accessToken` and `refreshToken` in `src/services/AuthService.ts`
- [ ] T006 [P] Verify `AuthController` response includes `user.role` in `src/controllers/AuthController.ts` (may need no changes if already returning full user object)
- [ ] T007 Verify `authMiddleware` populates `request.user.role` from JWT payload in `src/middlewares/authMiddleware.ts` (update if needed to extract role from token)

### Tests for First Delivery

- [ ] T008 [P] Create integration test for role persistence in `src/tests/rbac.integration.test.ts`: create user, verify user has `role: 'user'` in database
- [ ] T009 [P] Create integration test for JWT role payload: login, decode `accessToken`, verify `role` claim is present
- [ ] T010 Verify existing login and user creation tests still pass: `npm test -- --runInBand` (database override: `DB_HOST=localhost`)

---

## Phase 3: Second Delivery — Authorization Middleware & Route Protection

**Purpose**: Activate RBAC by restricting endpoints based on user role and ownership

**When complete**: Admin-only endpoints enforce access, owner-or-admin endpoints enforce access, system blocks unauthorized requests with `403`.

### Part A: Authorization Middleware

- [ ] T011 Create authorization middleware helper `src/middlewares/authorize.ts` with:
  - [ ] T011a `authorize(...allowedRoles: string[])` — returns middleware that allows only users with one of the listed roles
  - [ ] T011b `ensureOwnerOrRole(requiredRole: string)` — returns middleware that allows if `request.params.id == request.user.id` OR `request.user.role == requiredRole`
  - [ ] T011c Both middleware throw `AppError(403)` when authorization fails

### Part B: Route Protection

- [ ] T012 [P] Protect `GET /users` with `authorize('admin')` in `src/routes/userRoutes.ts` (admin only)
- [ ] T013 [P] Protect `PUT /users/:id` with `ensureOwnerOrRole('admin')` in `src/routes/userRoutes.ts` (owner or admin)
- [ ] T014 [P] Protect `DELETE /users/:id` with `ensureOwnerOrRole('admin')` in `src/routes/userRoutes.ts` (owner or admin)
- [ ] T015 Leave `GET /users/me` unmodified — accessible to any authenticated user

### Part C: Defensive Validation in Services

- [ ] T016 [P] Add defensive authorization check in `UpdateUserService` to verify owner or admin before allowing update in `src/services/UpdateUserService.ts`
- [ ] T017 [P] Add defensive authorization check in `DeleteUserService` to verify owner or admin before allowing delete in `src/services/DeleteUserService.ts`

### Tests for Second Delivery

- [ ] T018 [P] Integration test: authenticated user with `role: 'user'` requests `GET /users` → expects `403` in `src/tests/rbac.integration.test.ts`
- [ ] T019 [P] Integration test: authenticated user with `role: 'admin'` requests `GET /users` → expects `200` with user list
- [ ] T020 [P] Integration test: user updates own profile (`PUT /users/:id` where `id` is their own ID) → expects `200`
- [ ] T021 [P] Integration test: user attempts to update another user (`PUT /users/:id` where `id` is different user) → expects `403`
- [ ] T022 [P] Integration test: user deletes own account (`DELETE /users/:id` where `id` is their own ID) → expects `200`
- [ ] T023 [P] Integration test: user attempts to delete another user (`DELETE /users/:id` where `id` is different user) → expects `403`
- [ ] T024 Integration test: admin updates any user → expects `200`
- [ ] T025 Integration test: admin deletes any user → expects `200`
- [ ] T026 Integration test: `GET /users/me` continues to work for both `role: 'user'` and `role: 'admin'` → expects `200` with authenticated user profile

---

## Phase 4: Polish & Validation

**Purpose**: Cross-cutting improvements and full test coverage

- [ ] T027 Run complete test suite with `DB_HOST=localhost npm test -- --runInBand` and ensure all tests pass
- [ ] T028 Manually test login flow to confirm JWT payload includes role (e.g., decode token and inspect claims)
- [ ] T029 Manually test authorization rejection by attempting unauthorized requests and verifying `403` responses
- [ ] T030 Update `specs/002-user-authorization-rbac/spec.md` implementation status to completed
- [ ] T031 Add notes to `.github/copilot-instructions.md` documenting RBAC implementation (optional)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (First Delivery)**: Depends on Phase 1 - migration must be applied before code changes
- **Phase 3 (Second Delivery)**: Depends on Phase 2 - role data and JWT must be established first
- **Phase 4 (Polish)**: Depends on Phases 1-3 - all implementation complete before final validation

### Within First Delivery (Phase 2)

- T001-T002 (migration): Execute first before any code changes
- T003-T007 (implementation): Tasks T003-T006 marked [P] can run in parallel; T007 depends on them
- T008-T010 (tests): Can run after implementation is complete

### Within Second Delivery (Phase 3)

- T011 (middleware): Must complete before route protection (T012-T014)
- T012-T015 (route protection): Tasks marked [P] can run in parallel
- T016-T017 (defensive validation): Can run in parallel with route protection
- T018-T026 (tests): Can run after route protection and defensive validation complete

### Parallel Opportunities

**During First Delivery**:
- T003-T006 can all be implemented in parallel (different files, no dependencies)

**During Second Delivery**:
- T012-T014 (route protection) can run in parallel
- T016-T017 (defensive validation) can run in parallel
- T018-T023 (authorization tests) can run in parallel

---

## Incremental Delivery Strategy

### ✅ After First Delivery (Phase 2)
- Role column added to database with default `'user'`
- All new users receive `role: 'user'` automatically
- JWT payload includes `role` claim for every login
- System functionality is **identical** to before — no access restrictions yet
- All existing tests continue to pass
- Ready for user validation: "System works exactly as before, but now has role data"

### ⚠️ Between Deliveries
**Stop here for validation before proceeding to Second Delivery**
- Confirm Phase 2 implementation is stable
- Verify database migrations applied successfully
- Confirm JWT tokens include role
- Confirm existing endpoints continue working
- Get approval before activating authorization (Phase 3)

### 🔐 After Second Delivery (Phase 3)
- Authorization middleware enforces role-based access
- `GET /users` restricted to `role: 'admin'` only
- Update/delete endpoints enforce owner-or-admin rule
- `GET /users/me` remains accessible to all authenticated users
- All RBAC acceptance criteria met

---

## Rollback Plan

**If Phase 2 needs rollback**:
```bash
npm run migrate:down
```
This removes the `role` column and restores previous schema.

**If Phase 3 needs rollback**:
- Revert middleware changes in routes
- Removes authorization enforcement (but role data and JWT remain)
- System returns to Phase 2 state (fully functional with role data, no restrictions)

---

## Testing Commands

**Run all tests (after Phase 2 or Phase 3)**:
```bash
DB_HOST=localhost npm test -- --runInBand
```

**Run only RBAC tests**:
```bash
DB_HOST=localhost npm test -- --testNamePattern="RBAC|rbac" --runInBand
```

**Run with verbose output**:
```bash
DB_HOST=localhost npm test -- --verbose --runInBand
```
