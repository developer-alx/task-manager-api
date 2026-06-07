# Feature Specification: Task Management

**Feature Branch**: `003-task-management`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "Mapeamento da Phase 4 — Task Management. Evoluir a API Task Manager com um módulo completo de gerenciamento de tarefas. Permitir que usuários autenticados criem, consultem, atualizem e removam suas próprias tarefas. Reutilizar arquitetura existente de Users (JWT, Auth Middleware, RBAC, Owner Validation, Testes)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a personal task (Priority: P1)

An authenticated user wants to register a new task with a title and optional description so they can track work they need to complete.

**Why this priority**: Task creation is the foundational capability; without it, no other task management flow delivers value.

**Independent Test**: Authenticate as a normal user, submit a valid task via `POST /tasks`, and verify the response contains the created task with status `201` and default status `pending`.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they submit `POST /tasks` with a valid title and optional description, **Then** the API returns status `201` and a task owned by that user with status `pending`.
2. **Given** an unauthenticated request, **When** `POST /tasks` is called, **Then** the API returns status `401`.
3. **Given** an authenticated user, **When** they submit `POST /tasks` without a required title, **Then** the API returns status `400` with a validation error.

---

### User Story 2 - List my tasks (Priority: P1)

An authenticated user wants to see all tasks they own so they can review their current workload.

**Why this priority**: Listing owned tasks is the primary read path and enables daily task management.

**Independent Test**: Authenticate as a user with multiple tasks, call `GET /tasks`, and verify only tasks belonging to that user are returned with status `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user with existing tasks, **When** they request `GET /tasks`, **Then** the API returns status `200` and only tasks where they are the owner.
2. **Given** an authenticated user with no tasks, **When** they request `GET /tasks`, **Then** the API returns status `200` and an empty list.
3. **Given** an unauthenticated request, **When** `GET /tasks` is called, **Then** the API returns status `401`.

---

### User Story 3 - View a specific task (Priority: P1)

An authenticated user wants to retrieve details of a single task by its identifier to review or act on it.

**Why this priority**: Single-task retrieval is required for detail views and for validating ownership before updates or deletion.

**Independent Test**: Authenticate as the task owner, call `GET /tasks/:id`, and verify the full task is returned with status `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns the task, **When** they request `GET /tasks/:id`, **Then** the API returns status `200` and the task details.
2. **Given** an authenticated user who does not own the task and has role `user`, **When** they request `GET /tasks/:id` for another user's task, **Then** the API returns status `403`.
3. **Given** an authenticated user with role `admin`, **When** they request `GET /tasks/:id` for any task, **Then** the API returns status `200`.
4. **Given** a task identifier that does not exist, **When** an authenticated user requests `GET /tasks/:id`, **Then** the API returns status `404`.

---

### User Story 4 - Update a task (Priority: P2)

An authenticated user wants to update a task's title, description, or status so they can keep task information current as work progresses.

**Why this priority**: Updates enable the task lifecycle from pending through in progress to completed.

**Independent Test**: Authenticate as the task owner, call `PUT /tasks/:id` with a valid status change, and verify the response is `200` with updated fields and `updated_at` changed.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns the task, **When** they submit `PUT /tasks/:id` with valid fields, **Then** the API returns status `200` and the updated task.
2. **Given** an authenticated user who owns the task, **When** they submit `PUT /tasks/:id` with status `in_progress` or `completed`, **Then** the API accepts the change.
3. **Given** an authenticated user who owns the task, **When** they submit `PUT /tasks/:id` with an invalid status value, **Then** the API returns status `400`.
4. **Given** an authenticated user with role `user` who does not own the task, **When** they submit `PUT /tasks/:id`, **Then** the API returns status `403`.
5. **Given** an authenticated user with role `admin`, **When** they submit `PUT /tasks/:id` for any task, **Then** the API returns status `200`.

---

### User Story 5 - Delete a task (Priority: P2)

An authenticated user wants to remove a task they no longer need so their task list stays relevant.

**Why this priority**: Deletion completes the full lifecycle of task management and prevents clutter.

**Independent Test**: Authenticate as the task owner, call `DELETE /tasks/:id`, and verify status `200` (or `204`) and the task is no longer retrievable.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns the task, **When** they request `DELETE /tasks/:id`, **Then** the API returns a successful deletion response and the task is removed.
2. **Given** an authenticated user with role `user` who does not own the task, **When** they request `DELETE /tasks/:id`, **Then** the API returns status `403`.
3. **Given** an authenticated user with role `admin`, **When** they request `DELETE /tasks/:id` for any task, **Then** the API returns a successful deletion response.
4. **Given** a task identifier that does not exist, **When** an authenticated user requests `DELETE /tasks/:id`, **Then** the API returns status `404`.

---

### Edge Cases

- What happens when an unauthenticated user accesses any `/tasks` endpoint? The API must return `401`.
- What happens when a normal user tries to access another user's task? The API must return `403` for get, update, and delete operations.
- What happens when the task ID is valid but the task does not exist? The API must return `404`.
- What happens when the task ID format is invalid? The API must return `400` or `404` consistently with existing API conventions.
- What happens when creating a task with an empty or whitespace-only title? The API must return `400`.
- What happens when updating a task with a status outside the allowed set (`pending`, `in_progress`, `completed`)? The API must return `400`.
- What happens when an admin lists tasks via `GET /tasks`? The API returns only tasks owned by the authenticated admin, consistent with the list endpoint scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require valid authentication for all `/tasks` endpoints.
- **FR-002**: System MUST allow authenticated users to create tasks via `POST /tasks`.
- **FR-003**: System MUST assign each created task to exactly one owner (the authenticated user who created it).
- **FR-004**: System MUST persist every task with: `id`, `title`, `description` (optional), `status`, `user_id`, `created_at`, and `updated_at`.
- **FR-005**: System MUST set new tasks to status `pending` when no status is provided at creation.
- **FR-006**: System MUST accept only the following status values: `pending`, `in_progress`, and `completed`.
- **FR-007**: System MUST allow authenticated users to list their own tasks via `GET /tasks`.
- **FR-008**: System MUST NOT include tasks owned by other users in the response of `GET /tasks` for any authenticated user.
- **FR-009**: System MUST allow task owners to retrieve their tasks via `GET /tasks/:id`.
- **FR-010**: System MUST allow task owners to update their tasks via `PUT /tasks/:id`.
- **FR-011**: System MUST allow task owners to delete their tasks via `DELETE /tasks/:id`.
- **FR-012**: System MUST allow users with role `admin` to retrieve, update, and delete any task by identifier.
- **FR-013**: System MUST deny users with role `user` from retrieving, updating, or deleting tasks they do not own with HTTP status `403`.
- **FR-014**: System MUST return HTTP status `404` when a requested task does not exist.
- **FR-015**: System MUST validate required fields and allowed status values, returning HTTP status `400` for invalid input.
- **FR-016**: System MUST update `updated_at` whenever a task is modified.
- **FR-017**: System MUST reuse the existing authentication, role-based authorization, and owner-validation patterns established in the Users module.

### Key Entities *(include if feature involves data)*

- **Task**: Represents a work item owned by a single user. Key attributes: unique identifier, title, optional description, status (`pending`, `in_progress`, or `completed`), owner reference (`user_id`), creation timestamp, and last update timestamp.
- **User (existing)**: Represents an authenticated account that owns zero or more tasks. Authorization is determined by the existing `user` and `admin` roles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can create a task and receive confirmation in a single request without errors for valid input.
- **SC-002**: Users retrieve only their own tasks when listing, with 100% isolation from other users' data on `GET /tasks`.
- **SC-003**: Task owners can view, update, and delete their own tasks successfully in at least 95% of valid attempts under normal operating conditions.
- **SC-004**: Normal users receive `403` on every attempt to access another user's task by identifier.
- **SC-005**: Administrators can view, update, and delete any task by identifier without ownership restrictions.
- **SC-006**: Unauthenticated access to any task endpoint is rejected with `401` in 100% of attempts.
- **SC-007**: Invalid status values or missing required fields are rejected with `400` before any data is persisted or modified.
- **SC-008**: All five task operations (create, list, get by id, update, delete) are independently verifiable through acceptance scenarios.

## Assumptions

- The existing JWT authentication middleware, RBAC roles (`user` and `admin`), and owner-validation approach from the Users module remain in place and are extended to tasks.
- `GET /tasks` returns all tasks owned by the authenticated user without pagination in this phase.
- Task title is required; description is optional and may be empty or omitted.
- Default status for new tasks is `pending` unless explicitly provided at creation.
- Deletion is permanent; there is no soft-delete or archive behavior in this phase.
- Admin users listing via `GET /tasks` see only their own tasks; cross-user task discovery for admins is limited to direct access by task identifier.
- API documentation for task endpoints will be updated as part of the delivery workflow, consistent with existing project practices.
