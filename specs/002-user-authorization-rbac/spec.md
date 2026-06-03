# Feature Specification: User Authorization RBAC

**Feature Branch**: `002-user-authorization-rbac`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "Nova Feature: User Authorization RBAC\n\nObjetivo:\nImplementar controle de autorização baseado em papéis (RBAC) para usuários autenticados.\n\nContexto Atual:\nA API já possui:\n\n- Cadastro de usuários\n- Login com JWT\n- Middleware de autenticação\n- Buscar perfil autenticado\n- Listagem de usuários\n- Atualização de usuário\n- Exclusão de usuário\n\nProblema:\nAtualmente qualquer usuário autenticado pode acessar endpoints administrativos.\n\nObjetivo da evolução:\nAdicionar diferenciação entre usuários comuns e administradores.\n\nRegras:\n- Todo usuário novo deve possuir role = \"user\"\n- Administradores possuem role = \"admin\"\n- GET /users deve ser acessível apenas por admin\n- DELETE /users/:id deve permitir admin ou próprio usuário\n- PUT /users/:id deve permitir admin ou próprio usuário\n- GET /users/me continua acessível para qualquer usuário autenticado\n- JWT deve carregar role do usuário autenticado\n\nCritérios de aceitação:\n- Usuário comum recebe 403 ao listar usuários\n- Admin consegue listar usuários\n- Usuário comum pode editar apenas seu perfil\n- Admin pode editar qualquer perfil\n- Usuário comum pode excluir apenas sua conta\n- Admin pode excluir qualquer conta\n\nSeguir arquitetura atual:\nRoutes → Controllers → Services → Repository → PostgreSQL\n\nManter compatibilidade com Docker, PostgreSQL e JWT já existentes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin lists users (Priority: P1)

An administrator needs to see all registered users so they can manage the application user base.

**Why this priority**: This is the core administrative capability that must be restricted to admin users.

**Independent Test**: Authenticate as an admin user, request `GET /users`, and verify the response contains a user list with status `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user with role `admin`, **When** they request `GET /users`, **Then** the API returns status `200` and a list of users.
2. **Given** an authenticated user with role `user`, **When** they request `GET /users`, **Then** the API returns status `403` and an authorization error.

---

### User Story 2 - User edits own profile (Priority: P1)

A normal authenticated user needs to update their own profile without being able to modify other users.

**Why this priority**: Protecting user profile updates prevents unauthorized changes and supports the main self-service flow.

**Independent Test**: Authenticate as a normal user, call `PUT /users/:id` with their own ID, and verify the update succeeds with status `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user with role `user`, **When** they request `PUT /users/:id` for their own user ID, **Then** the API returns status `200` and updates the profile.
2. **Given** an authenticated user with role `user`, **When** they request `PUT /users/:id` for another user ID, **Then** the API returns status `403`.

---

### User Story 3 - Admin edits any profile (Priority: P2)

An administrator needs to update any user profile in the system.

**Why this priority**: Admins must be able to manage user accounts beyond their own profile.

**Independent Test**: Authenticate as an admin, call `PUT /users/:id` for another user, and verify the response is `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user with role `admin`, **When** they request `PUT /users/:id` for any user, **Then** the API returns status `200` and updates the selected profile.

---

### User Story 4 - User deletes own account (Priority: P1)

A normal authenticated user needs to delete their own account while being blocked from deleting other accounts.

**Why this priority**: Self-service account deletion is a common user expectation and must be secure.

**Independent Test**: Authenticate as a normal user, call `DELETE /users/:id` with their own ID, and verify the response is `200` and the account is removed.

**Acceptance Scenarios**:

1. **Given** an authenticated user with role `user`, **When** they request `DELETE /users/:id` for their own ID, **Then** the API returns status `200` and the account is deleted.
2. **Given** an authenticated user with role `user`, **When** they request `DELETE /users/:id` for another user ID, **Then** the API returns status `403`.

---

### User Story 5 - Admin deletes any account (Priority: P2)

An administrator needs to delete any user account for maintenance or compliance reasons.

**Why this priority**: Admins require full account management authority.

**Independent Test**: Authenticate as an admin, call `DELETE /users/:id` for another user, and verify status `200`.

**Acceptance Scenarios**:

1. **Given** an authenticated user with role `admin`, **When** they request `DELETE /users/:id` for any user, **Then** the API returns status `200`.

---

### Edge Cases

- What happens when a valid JWT is missing a role claim? The API should reject the request with `401` or `403` depending on the middleware semantics.
- How does the system handle an admin attempting to modify or delete a user that does not exist? The API should return `404`.
- How does the system handle an admin trying to update role on a normal user if role changes are not part of this feature? The request should deny role modification unless explicitly allowed by future admin role management.
- What happens when a user is authenticated but the target `:id` is malformed? The API should return `400` or `404` consistently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST assign `role = "user"` to every newly created user by default.
- **FR-002**: System MUST preserve `role = "admin"` for administrator users and include role information in the authenticated user payload.
- **FR-003**: System MUST include the authenticated user role in the JWT payload for every login response.
- **FR-004**: System MUST allow `GET /users` only for authenticated users with role `admin`.
- **FR-005**: System MUST allow `PUT /users/:id` for an authenticated user when the target `:id` matches their own user ID.
- **FR-006**: System MUST allow `PUT /users/:id` for an authenticated user with role `admin` for any user ID.
- **FR-007**: System MUST allow `DELETE /users/:id` for an authenticated user when the target `:id` matches their own user ID.
- **FR-008**: System MUST allow `DELETE /users/:id` for an authenticated user with role `admin` for any user ID.
- **FR-009**: System MUST keep `GET /users/me` accessible to any authenticated user regardless of role.
- **FR-010**: System MUST reject unauthorized admin-level requests with HTTP status `403`.
- **FR-011**: System MUST reject requests lacking valid authentication with the existing authentication middleware.
- **FR-012**: System MUST maintain the current architecture flow: routes call controllers, controllers call services, services call repositories, and repositories access PostgreSQL.

### Key Entities *(include if feature involves data)*

- **User**: Represents a registered account with attributes such as `id`, `name`, `email`, `password`, `role`, and `created_at`.
- **Role**: Represents the user's authorization level with values `user` or `admin` and is used to determine access to protected endpoints.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin users can list all users via `GET /users` and normal users consistently receive `403` for that endpoint.
- **SC-002**: Normal users can successfully update their own profile and consistently receive `403` when attempting to update another user's profile.
- **SC-003**: Normal users can successfully delete their own account and consistently receive `403` when attempting to delete another user's account.
- **SC-004**: Admin users can update and delete any user profile successfully.
- **SC-005**: The login JWT payload includes the authenticated user's role on every successful login.
- **SC-006**: `GET /users/me` continues to return profile data for any authenticated user.

## Assumptions

- The existing user registration flow can be extended to store a `role` field without breaking current user creation behavior.
- Existing authentication middleware already validates JWTs and can be extended to expose user role information to downstream handlers.
- Role assignment and admin status are configured outside this feature for seed/admin creation or manual data setup.
- There is no requirement in this feature to add a dedicated admin role management UI or API beyond enforcing access rules on existing endpoints.
