# Implementation Plan: Task Management

**Branch**: `003-task-management` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-task-management/spec.md`

## Summary

Evoluir a API Task Manager com um módulo completo de gerenciamento de tarefas (CRUD), reutilizando JWT, `authMiddleware`, RBAC (`user`/`admin`) e o padrão de validação de owner já estabelecido no módulo Users. A implementação alinha o schema existente (`tasks`) à spec (campo `status` em vez de `completed`, adicionar `updated_at`), introduz DTOs Zod, centraliza autorização owner/admin nos services, documenta endpoints no Swagger e cobre cenários com testes de integração.

## Technical Context

**Language/Version**: TypeScript 6, Node.js >= 18

**Primary Dependencies**: Express 5, `pg`, `jsonwebtoken`, `zod`, `swagger-jsdoc`, `swagger-ui-express`, `winston`, `node-pg-migrate`

**Storage**: PostgreSQL 15 (Docker); migrations via `node-pg-migrate`

**Testing**: Jest + Supertest (`src/tests/`); padrão de referência em `rbac.integration.test.ts`

**Target Platform**: Linux / Docker (`docker-compose.yml`, porta `3333`)

**Project Type**: REST API (web service)

**Performance Goals**: Sem SLA explícito; listagem sem paginação nesta fase (retorno de todas as tarefas do owner autenticado)

**Constraints**: Arquitetura em camadas obrigatória; rotas protegidas com `authMiddleware`; alterações de schema somente via migration; controllers não acessam banco diretamente; senhas/dados sensíveis nunca expostos

**Scale/Scope**: CRUD de tarefas por usuário autenticado; 5 endpoints; autorização owner + bypass admin em operações por `:id`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Conformidade | Notas |
|-----------|--------------|-------|
| I. Arquitetura em Camadas | ✅ | Routes → TaskController → Services → TaskRepository → PostgreSQL |
| II. Responsabilidade Única | ✅ | Um service por operação (`CreateTaskService`, `ListTasksService`, etc.) |
| III. Evolução Orientada por Features | ✅ | Migration → Repository → Services → Controller → Routes → Build → Testes → Docs |
| IV. Segurança de API | ✅ | `authMiddleware` em todos os endpoints `/tasks`; owner/admin nos services |
| V. Validação e Documentação | ✅ | Zod nos DTOs; Swagger em `taskRoutes.ts`; testes de integração planejados |
| Database Governance | ✅ | Nova migration para `status` + `updated_at`; sem alteração manual no banco |
| Development Workflow | ✅ | `npm run build`, docker compose rebuild, validação Insomnia documentada em quickstart |

**Post-design re-check**: Nenhuma violação identificada. Autorização owner/admin nos services (em vez de `ensureOwnerOrRole` nas rotas) é justificada porque o owner de tasks é `task.user_id`, não `params.id` — padrão defensivo já usado em `UpdateUserService`/`DeleteUserService`.

## Project Structure

### Documentation (this feature)

```text
specs/003-task-management/
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas (Phase 0)
├── data-model.md        # Entidade Task (Phase 1)
├── quickstart.md        # Guia de validação (Phase 1)
├── contracts/
│   └── openapi.md       # Contrato dos endpoints (Phase 1)
├── checklists/
│   └── requirements.md  # Checklist da spec
└── tasks.md             # Gerado por /speckit-tasks (não criado aqui)
```

### Source Code (repository root)

```text
src/
├── controllers/
│   └── TaskController.ts          # Atualizar: Zod, AppError, passar role/id
├── services/
│   ├── CreateTaskService.ts
│   ├── ListTasksService.ts
│   ├── GetTaskByIdService.ts
│   ├── UpdateTaskService.ts
│   └── DeleteTaskService.ts       # Adicionar owner/admin + AppError
├── repositories/
│   └── TaskRepository.ts          # Atualizar: status, updated_at, delete admin
├── routes/
│   └── taskRoutes.ts              # Adicionar Swagger JSDoc
├── modules/
│   └── tasks/
│       └── dto/
│           ├── CreateTaskDTO.ts
│           └── UpdateTaskDTO.ts
├── middlewares/
│   ├── authMiddleware.ts          # Reutilizar (sem alteração esperada)
│   └── authorize.ts               # Reutilizar padrão admin bypass nos services
└── tests/
    └── tasks.integration.test.ts  # Novo: CRUD + autorização

migrations/
└── <timestamp>_align-tasks-schema.js   # status enum + updated_at; remover completed
```

**Structure Decision**: Projeto single-package com camadas flat em `src/`, espelhando o módulo Users. DTOs em `src/modules/tasks/dto/` seguindo convenção de `src/modules/users/dto/`.

## Implementation Phases

### Phase A — Schema (migration)

1. Criar migration `align-tasks-schema`:
   - Remover coluna `completed`
   - Adicionar `status VARCHAR(20) NOT NULL DEFAULT 'pending'` com check constraint (`pending`, `in_progress`, `completed`)
   - Adicionar `updated_at TIMESTAMP DEFAULT current_timestamp`
   - Trigger ou atualização explícita de `updated_at` no repository em UPDATE
2. Executar `npm run migrate:up`

### Phase B — Repository

Atualizar `TaskRepository.ts`:
- `create`: aceitar `status` opcional (default `pending` no service)
- `findByUser`, `findById`: retornar `status`, `updated_at`
- `update`: campos dinâmicos (`title`, `description`, `status`); setar `updated_at`
- `delete`: suportar delete por admin (sem filtro `user_id` quando admin) ou manter lógica no service com `findById` + delete por id

### Phase C — DTOs e validação

Criar em `src/modules/tasks/dto/`:
- `CreateTaskSchema`: `title` obrigatório (min 1, trim), `description` opcional, `status` opcional (enum)
- `UpdateTaskSchema`: campos opcionais, pelo menos um campo; `status` enum

### Phase D — Services (regras de negócio + autorização)

| Service | Responsabilidades |
|---------|-------------------|
| `CreateTaskService` | Default `status = pending`; validar título |
| `ListTasksService` | Filtrar por `user_id` do autenticado |
| `GetTaskByIdService` | 404 se não existe; 403 se user comum e `task.user_id !== authId`; admin bypass |
| `UpdateTaskService` | Mesma regra owner/admin; validar status; atualizar `updated_at` |
| `DeleteTaskService` | Mesma regra owner/admin; 404 se não existe |

Padrão de autorização (replicar Users):

```typescript
if (authenticatedUserRole !== "admin" && task.user_id !== authenticatedUserId) {
  throw new AppError("Access denied", 403);
}
```

### Phase E — Controller e Routes

- `TaskController`: usar Zod `.parse()`, `AppError` via `errorHandler`, propagar `request.userId` e `request.userRole`
- `taskRoutes.ts`: manter `authMiddleware` em todas as rotas; adicionar blocos `@swagger` (tag `[Tasks]`)
- Registrar rotas já existentes em `app.ts` (sem alteração estrutural)

### Phase F — Testes

Criar `src/tests/tasks.integration.test.ts` cobrindo:
- T001–T004 implícitos: create, list, get, update, delete (happy path)
- 401 sem token
- 403 user acessando task de outro
- 404 task inexistente
- 400 título vazio / status inválido
- Admin get/update/delete task de outro usuário

Execução: `DB_HOST=localhost npm test -- --runInBand`

### Phase G — Documentação

- Swagger JSDoc em `taskRoutes.ts`
- Atualizar README com endpoints de tasks (se necessário após implementação)

## Complexity Tracking

Nenhuma violação da constituição. Sem entradas obrigatórias.

## Risks and Mitigation

| Risco | Mitigação |
|-------|-----------|
| Migration altera coluna `completed` existente | Migration com `up`/`down`; testar em ambiente local antes de deploy |
| Código parcial de Tasks usa `completed: boolean` | Atualizar repository, services, controller e testes na mesma feature |
| Owner check inconsistente (hoje no controller) | Mover toda autorização para services; controller apenas orquestra |
| Rate limit em `/login` nos testes | Gerar JWT diretamente (padrão `rbac.integration.test.ts`) |

## Useful Commands

```bash
npm run migrate:create -- align-tasks-schema
npm run migrate:up
npm run build
docker compose down && docker compose build --no-cache && docker compose up -d
DB_HOST=localhost npm test -- --runInBand
```

**Próximo passo sugerido**: `/speckit-tasks` para gerar `tasks.md` com T001–T017.
