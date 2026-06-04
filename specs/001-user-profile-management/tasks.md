# Tasks: User Profile Management

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create feature documentation and plan files in specs/001-user-profile-management (spec.md, plan.md, research.md, data-model.md, quickstart.md)
- [ ] T002 Add `UpdateUserDTO.ts` in src/modules/users/dto/ to validate profile updates
- [ ] T003 Add basic contract summary in specs/001-user-profile-management/contracts/openapi.md

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T004 [P] Implement `findAll()` in src/repositories/UserRepository.ts to return all users (exclude soft-deleted if implemented)
- [X] T005 [P] Implement `findById(id: number)` in src/repositories/UserRepository.ts
- [X] T006 [P] Implement `update(id: number, data)` in src/repositories/UserRepository.ts
- [x] T007 [P] Implement `delete(id: number)` in src/repositories/UserRepository.ts (decide soft vs hard delete)
- [X] T008 Add `src/modules/users/dto/UpdateUserDTO.ts` and export validation schema for controllers/services
- [X] T009 Ensure `authMiddleware` is exported and usable from src/middlewares/authMiddleware.ts
- [X] T010 Add unit tests for repository methods in src/tests/repositories/userRepository.test.ts

## Phase 3: User Story 1 - Authenticated user views own profile (Priority: P1)

- [X] T011 [US1] Implement `GetUserByIdService` in src/services/GetUserByIdService.ts (use `UserRepository.findById` and strip sensitive fields)
- [X] T012 [US1] Add `show` handler in src/controllers/UserController.ts to call `GetUserByIdService` and format response
- [ ] T013 [US1] Add integration tests for `GET /users/:id` in src/tests/integration/getUserById.test.ts (authenticated user, 404 case)

## Phase 4: User Story 2 - Admin lists all users (Priority: P2)

- [X] T014 [US2] Implement `ListUsersService` in src/services/ListUsersService.ts (use `UserRepository.findAll` and strip sensitive fields)
- [X] T015 [US2] Add `list` handler in src/controllers/UserController.ts to call `ListUsersService`
- [ ] T016 [US2] Register `GET /users` in src/routes/userRoutes.ts and protect with `authMiddleware` plus admin guard logic
- [ ] T017 [US2] Add integration tests for `GET /users` in src/tests/integration/listUsers.test.ts (admin success, non-admin 403)

## Phase 5: User Story 3 - User updates own profile (Priority: P3)

- [X] T018 [US3] Implement `UpdateUserService` in src/services/UpdateUserService.ts (authorize: owner or admin; validate input via `UpdateUserDTO`)
- [X] T019 [US3] Add `update` handler in src/controllers/UserController.ts to call `UpdateUserService` and return updated profile
- [ ] T020 [US3] Add integration tests for `PUT /users/:id` in src/tests/integration/updateUser.test.ts (owner success, forbidden for other users)

## Phase 6: User Story 4 - User or admin deletes account (Priority: P4)

- [X] T021 [US4] Implement `DeleteUserService` in src/services/DeleteUserService.ts (authorize: owner or admin; decide soft vs hard delete)
- [X] T022 [US4] Add `delete` handler in src/controllers/UserController.ts to call `DeleteUserService`
- [ ] T023 [US4] Add integration tests for `DELETE /users/:id` in src/tests/integration/deleteUser.test.ts (owner success, forbidden for others)

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T024 Update Swagger docs: src/shared/docs/swagger.ts and specs/001-user-profile-management/contracts/openapi.md
- [ ] T025 Ensure no responses expose `password` field (audit controllers/services)
- [ ] T026 Update README.md and feature plan with implementation notes and any migration instructions
- [ ] T027 Add migration if schema changes were chosen (create under migrations/ and document how to apply)

## Dependencies

- Phase 2 tasks (T004-T007, T008) must complete before services (T011, T014, T018, T021).
- `GetUserByIdService` (T011) is independent and should be implemented first as MVP.

## Parallel execution examples

- `T004`, `T005`, `T006`, `T007` (repository methods) can be implemented in parallel across different files.
- Service implementations for different stories (`T011`, `T014`, `T018`, `T021`) can be worked on in parallel once repository methods exist.

## Independent test criteria (per story)

- US1: Authenticated user can `GET /users/:id` for own id and receives a user object without `password`; 404 for missing id.
- US2: Admin user can `GET /users` and receives list without `password`; non-admin receives 403.
- US3: Owner can `PUT /users/:id` to update allowed fields and receive updated user; non-owner non-admin receives 403.
- US4: Owner can `DELETE /users/:id` resulting in 204; non-owner non-admin receives 403.

## Suggested MVP scope

- Implement US1 first (T011-T013) to enable authenticated profile retrieval.
- Then implement US2 (T014-T017) for admin listing.

## Format validation

All tasks follow the checklist format: each line begins with `- [ ] T###` and includes file paths where applicable.
