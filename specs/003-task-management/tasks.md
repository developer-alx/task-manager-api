---
description: "Task list for Task Management feature (Phase 4) — T001 to T017"
---

# Tasks: Task Management

**Feature**: `003-task-management`  
**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/openapi.md](./contracts/openapi.md), [research.md](./research.md), [quickstart.md](./quickstart.md)  
**Branch**: `003-task-management`  
**Strategy**: Implementação incremental — migration → repository → DTOs → services → controller/routes → autorização → Swagger → testes  
**Tests**: Incluídos (T013–T017) conforme entregáveis da feature

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: User story da spec (`US1`–`US5`)

---

## Phase 1: Setup (Database Schema)

**Purpose**: Alinhar schema `tasks` à spec (`status`, `updated_at`; remover `completed`)

**Checkpoint**: Migration aplicada; tabela `tasks` compatível com [data-model.md](./data-model.md)

- [ ] T001 Criar migration `align-tasks-schema` em `migrations/<timestamp>_align-tasks-schema.js` (remover `completed`, adicionar `status` com default `pending` e check constraint, adicionar `updated_at`) e aplicar com `npm run migrate:up`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada de persistência e validação compartilhada por todas as user stories

**⚠️ CRITICAL**: Nenhuma user story pode ser concluída até T002 e T003 estarem prontos

- [ ] T002 [P] Atualizar `TaskRepository` em `src/repositories/TaskRepository.ts` para suportar `status`, `updated_at`, update dinâmico de campos e delete por `id` (conforme [data-model.md](./data-model.md))
- [ ] T003 [P] Criar DTOs e validações Zod em `src/modules/tasks/dto/CreateTaskDTO.ts` e `src/modules/tasks/dto/UpdateTaskDTO.ts` (`title` obrigatório, `status` enum `pending`|`in_progress`|`completed`)

**Checkpoint**: Repository e DTOs prontos — services podem ser implementados

---

## Phase 3: User Story 1 — Create a personal task (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado cria tarefa com título e descrição opcional; status default `pending`

**Independent Test**: `POST /tasks` com token válido retorna `201` e tarefa com `user_id` do autenticado; sem token retorna `401`; título vazio retorna `400`

### Implementation

- [ ] T004 [US1] Implementar `CreateTaskService` em `src/services/CreateTaskService.ts` (default `status = pending`, associar `user_id` ao autenticado, usar `TaskRepository.create`)

### Tests

- [ ] T013 [US1] Adicionar testes de criação em `src/tests/tasks.integration.test.ts`: `POST /tasks` happy path (`201`), `401` sem token, `400` título vazio/inválido

**Checkpoint**: Criação de tarefas funcional e testada

---

## Phase 4: User Story 2 — List my tasks (Priority: P1)

**Goal**: Usuário autenticado lista apenas suas próprias tarefas

**Independent Test**: `GET /tasks` retorna `200` com array filtrado por `user_id`; lista vazia quando sem tarefas; `401` sem token

### Implementation

- [ ] T005 [US2] Implementar `ListTasksService` em `src/services/ListTasksService.ts` (filtrar por `user_id` do autenticado via `TaskRepository.findByUser`)

### Tests

- [ ] T014 [US2] Adicionar testes de listagem em `src/tests/tasks.integration.test.ts`: `GET /tasks` retorna só tarefas do owner, lista vazia, `401` sem token

**Checkpoint**: Listagem isolada por owner funcional e testada

---

## Phase 5: User Story 3 — View a specific task (Priority: P1)

**Goal**: Owner ou admin recupera tarefa por id; user comum recebe `403` em tarefa alheia; inexistente retorna `404`

**Independent Test**: `GET /tasks/:id` com owner → `200`; outro user → `403`; admin → `200`; id inexistente → `404`

### Implementation

- [ ] T006 [US3] Implementar `GetTaskByIdService` em `src/services/GetTaskByIdService.ts` (404 via `AppError` se não existe; base para regras owner/admin em T011)

**Checkpoint**: Busca por id implementada (autorização refinada em T011)

---

## Phase 6: User Story 4 — Update a task (Priority: P2)

**Goal**: Owner ou admin atualiza `title`, `description` e `status`; `updated_at` atualizado

**Independent Test**: `PUT /tasks/:id` com status válido → `200`; status inválido → `400`; user em tarefa alheia → `403`; admin → `200`

### Implementation

- [ ] T007 [US4] Implementar `UpdateTaskService` em `src/services/UpdateTaskService.ts` (validar status enum, atualizar `updated_at`, base para owner/admin em T011)

### Tests

- [ ] T015 [US4] Adicionar testes de atualização em `src/tests/tasks.integration.test.ts`: owner `200`, status inválido `400`, user não-owner `403`, admin `200`

**Checkpoint**: Atualização funcional e testada

---

## Phase 7: User Story 5 — Delete a task (Priority: P2)

**Goal**: Owner ou admin remove tarefa permanentemente

**Independent Test**: `DELETE /tasks/:id` owner → sucesso; user não-owner → `403`; admin → sucesso; inexistente → `404`

### Implementation

- [ ] T008 [US5] Implementar `DeleteTaskService` em `src/services/DeleteTaskService.ts` (delete permanente, base para owner/admin em T011)

### Tests

- [ ] T016 [US5] Adicionar testes de exclusão em `src/tests/tasks.integration.test.ts`: owner sucesso, user não-owner `403`, admin sucesso, id inexistente `404`

**Checkpoint**: Exclusão funcional e testada

---

## Phase 8: HTTP Layer, Authorization & Documentation

**Purpose**: Controller, rotas, regras owner/admin centralizadas, Swagger

**Depends on**: T004–T008 (services), T003 (DTOs)

### Implementation

- [ ] T009 Implementar `TaskController` em `src/controllers/TaskController.ts` (Zod parse, propagar `request.userId`/`request.userRole`, `AppError` via `errorHandler`, métodos create/list/show/update/delete)
- [ ] T010 Criar/ajustar rotas em `src/routes/taskRoutes.ts` (`POST/GET/PUT/DELETE /tasks`, `authMiddleware` em todos os endpoints; registrar em `src/app.ts` se necessário)
- [ ] T011 Aplicar regras owner/admin em `src/services/GetTaskByIdService.ts`, `src/services/UpdateTaskService.ts` e `src/services/DeleteTaskService.ts` (padrão: `authenticatedUserRole !== 'admin' && task.user_id !== authenticatedUserId` → `AppError(403)`; remover checagens duplicadas de `src/controllers/TaskController.ts`)
- [ ] T012 Adicionar documentação Swagger (`@swagger`, tag `[Tasks]`) em `src/routes/taskRoutes.ts` conforme [contracts/openapi.md](./contracts/openapi.md)

### Tests

- [ ] T017 Adicionar testes de autorização em `src/tests/tasks.integration.test.ts`: matriz user/admin para `GET/PUT/DELETE /tasks/:id`, `401` em todos os endpoints sem token, isolamento em `GET /tasks` (admin vê só próprias tarefas na listagem)

**Checkpoint**: API completa documentada, autorizada e coberta por testes

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (T001)
    └── Phase 2 (T002, T003)
            ├── Phase 3 (T004, T013) — US1 Create 🎯 MVP
            ├── Phase 4 (T005, T014) — US2 List
            ├── Phase 5 (T006)       — US3 Get
            ├── Phase 6 (T007, T015) — US4 Update
            └── Phase 7 (T008, T016) — US5 Delete
                    └── Phase 8 (T009 → T010 → T011 → T012 → T017)
```

### User Story Dependencies

| Story | Tasks | Depende de |
|-------|-------|------------|
| US1 Create (P1) | T004, T013 | T002, T003 |
| US2 List (P1) | T005, T014 | T002 |
| US3 Get (P1) | T006 | T002 |
| US4 Update (P2) | T007, T015 | T002, T003 |
| US5 Delete (P2) | T008, T016 | T002 |
| Cross-cutting | T009–T012, T017 | T004–T008, T003 |

### Parallel Opportunities

| Grupo | Tasks | Condição |
|-------|-------|----------|
| Foundational | T002, T003 | Após T001 |
| Services (parcial) | T004, T005, T006 | Após T002+T003; arquivos distintos |
| Services (parcial) | T007, T008 | Após T002+T003; paralelo entre si |
| Testes por story | T013, T014, T015, T016 | Após service correspondente + T009/T010 para HTTP |
| Swagger | T012 | Paralelo a T017 após T010 |

### Parallel Example: Foundational

```bash
# Após T001 concluído:
Task T002: "Atualizar TaskRepository em src/repositories/TaskRepository.ts"
Task T003: "Criar DTOs em src/modules/tasks/dto/"
```

### Parallel Example: Services

```bash
# Após T002+T003:
Task T004: "CreateTaskService em src/services/CreateTaskService.ts"
Task T005: "ListTasksService em src/services/ListTasksService.ts"
Task T006: "GetTaskByIdService em src/services/GetTaskByIdService.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. T001 → T002 + T003 (foundational)
2. T004 (CreateTaskService)
3. T009 + T010 (controller + rotas mínimas para `POST /tasks`)
4. T013 (testes de criação)
5. **Validar**: `POST /tasks` via [quickstart.md](./quickstart.md) SC-1

### Incremental Delivery

1. **MVP**: US1 (create) — T001–T004, T009–T010, T013
2. **Read paths**: US2 + US3 — T005–T006, T014
3. **Mutations**: US4 + US5 — T007–T008, T015–T016
4. **Hardening**: T011 (owner/admin), T012 (Swagger), T017 (autorização)
5. Validar cenários completos em [quickstart.md](./quickstart.md)

### Validation Commands

```bash
npm run migrate:up
npm run build
DB_HOST=localhost npm test -- --runInBand --testPathPattern=tasks
docker compose down && docker compose build --no-cache && docker compose up -d
```

---

## Task Summary

| ID | Story | Descrição | Arquivo principal |
|----|-------|-----------|-------------------|
| T001 | — | Migration align-tasks-schema | `migrations/<timestamp>_align-tasks-schema.js` |
| T002 | — | TaskRepository | `src/repositories/TaskRepository.ts` |
| T003 | — | DTOs Zod | `src/modules/tasks/dto/` |
| T004 | US1 | CreateTaskService | `src/services/CreateTaskService.ts` |
| T005 | US2 | ListTasksService | `src/services/ListTasksService.ts` |
| T006 | US3 | GetTaskByIdService | `src/services/GetTaskByIdService.ts` |
| T007 | US4 | UpdateTaskService | `src/services/UpdateTaskService.ts` |
| T008 | US5 | DeleteTaskService | `src/services/DeleteTaskService.ts` |
| T009 | — | TaskController | `src/controllers/TaskController.ts` |
| T010 | — | Rotas /tasks | `src/routes/taskRoutes.ts` |
| T011 | — | Regras owner/admin | `src/services/GetTaskByIdService.ts`, `UpdateTaskService.ts`, `DeleteTaskService.ts` |
| T012 | — | Swagger | `src/routes/taskRoutes.ts` |
| T013 | US1 | Testes criação | `src/tests/tasks.integration.test.ts` |
| T014 | US2 | Testes listagem | `src/tests/tasks.integration.test.ts` |
| T015 | US4 | Testes atualização | `src/tests/tasks.integration.test.ts` |
| T016 | US5 | Testes exclusão | `src/tests/tasks.integration.test.ts` |
| T017 | — | Testes autorização | `src/tests/tasks.integration.test.ts` |

**Total**: 17 tasks (T001–T017)

---

## Notes

- Código parcial de Tasks já existe; T002–T012 são **atualizações/alinhamentos**, não criação do zero
- JWT nos testes: gerar diretamente com `jwt.sign` (padrão `src/tests/rbac.integration.test.ts`)
- T011 deve centralizar autorização nos services; controller não deve duplicar lógica de owner
- Commit após cada task ou grupo lógico; validar build antes de avançar (constituição do projeto)
