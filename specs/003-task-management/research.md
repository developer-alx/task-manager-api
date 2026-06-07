# research.md — Task Management

## Decisions

### Decision: Reutilizar `authMiddleware` e JWT existentes sem alterar fluxo de login

**Rationale**: O módulo Users já expõe `request.userId` e `request.userRole` via `authMiddleware`. A spec (FR-001, FR-017) exige autenticação em todos os endpoints de tasks.

**Alternatives considered**:
- Novo middleware específico para tasks — rejeitado por duplicação desnecessária.

---

### Decision: Autorização owner/admin implementada nos Services (não via `ensureOwnerOrRole` nas rotas)

**Rationale**: Em Users, `ensureOwnerOrRole('admin')` compara `params.id` com `userId`. Em Tasks, o owner é `task.user_id`, obtido após consulta ao banco. O padrão defensivo em `UpdateUserService`/`DeleteUserService` já valida owner/admin no service — replicar para tasks.

**Alternatives considered**:
- Middleware genérico que carrega task antes do controller — rejeitado por misturar persistência com camada HTTP.
- Autorização apenas no controller (estado atual parcial em `TaskController.show`) — rejeitado por inconsistência e violação do padrão Users.

---

### Decision: Substituir `completed: boolean` por `status` enum (`pending`, `in_progress`, `completed`)

**Rationale**: A spec (FR-004, FR-006) define status como enum de três valores. A migration existente (`1776500000000_create-tasks.js`) usa `completed: boolean`, incompatível com a spec.

**Alternatives considered**:
- Manter `completed` e mapear no service — rejeitado por não atender FR-006 nem o modelo de ciclo de vida da spec.
- Adicionar `status` mantendo `completed` — rejeitado por redundância.

**Migration approach**: Nova migration remove `completed`, adiciona `status` com default `pending` e check constraint.

---

### Decision: Adicionar coluna `updated_at` com atualização no Repository em UPDATE

**Rationale**: FR-016 exige `updated_at` em toda modificação. Padrão já presente na entidade User.

**Alternatives considered**:
- Trigger PostgreSQL `BEFORE UPDATE` — viável, mas o projeto atualiza timestamps explicitamente no repository (padrão Users).

---

### Decision: Validação de entrada com Zod em `src/modules/tasks/dto/`

**Rationale**: Módulo Users usa Zod (`CreateUserSchema`, etc.). FR-015 exige validação de campos obrigatórios e status.

**Alternatives considered**:
- Validação manual no controller — rejeitado por inconsistência com Users.

---

### Decision: Erros via `AppError` + `errorHandler` global

**Rationale**: Controllers de Tasks atualmente retornam `response.status().json()` diretamente em alguns fluxos. Users e RBAC usam `AppError` propagado ao `errorHandler`.

**Alternatives considered**:
- Manter respostas manuais no controller — rejeitado por inconsistência e duplicação de formato de erro.

---

### Decision: Testes de integração com JWT gerado diretamente

**Rationale**: `rbac.integration.test.ts` usa `jwt.sign({ userId, role }, JWT_SECRET)` para evitar rate limit de `/login` e exercitar `authMiddleware` de forma determinística.

**Alternatives considered**:
- Login via API em cada teste — rejeitado por flakiness e rate limit.

---

### Decision: `GET /tasks` retorna apenas tarefas do usuário autenticado (incluindo admin)

**Rationale**: Spec assumption e FR-008; admin acessa tarefas de outros apenas por `GET /tasks/:id` com bypass de owner.

**Alternatives considered**:
- Admin lista todas as tarefas — rejeitado por estar fora do escopo da spec.

---

### Decision: Paginação fora de escopo nesta fase

**Rationale**: Assumption explícita na spec; volume esperado em desenvolvimento não justifica complexidade adicional.

**Alternatives considered**:
- `limit`/`offset` query params — adiado para feature futura.

---

## Resolved Clarifications (from Technical Context)

| Item | Resolution |
|------|------------|
| Performance SLAs | Sem meta numérica; resposta síncrona padrão REST |
| Scale | Single-node API; listagem completa por owner |
| Delete strategy | Hard delete permanente (spec assumption) |
| Default status on create | `pending` quando omitido |
