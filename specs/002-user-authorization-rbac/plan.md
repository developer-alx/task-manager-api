# Plano de Implementação: User Authorization RBAC

**Feature**: User Authorization RBAC
**Diretório**: specs/002-user-authorization-rbac
**Autor**: agente
**Data**: 2026-06-03

## Objetivo
Implementar controle de autorização baseado em papéis (RBAC) para usuários autenticados sem alterar endpoints, fluxo de autenticação, Docker, PostgreSQL ou módulos de Tasks.

## Contexto técnico
- Arquitetura atual: `Routes -> Controllers -> Services -> Repositories -> PostgreSQL`.
- Já existe: cadastro de usuários, login JWT, middleware de autenticação, endpoints `GET /users`, `GET /users/me`, `PUT /users/:id`, `DELETE /users/:id`.
- Premissa importante: o `authMiddleware` deve popular `request.user` com pelo menos `{ id, email }`. Precisamos garantir que ele passe também `role` ou atualizá-lo para carregar `role` do banco.

## Artefatos a criar/alterar
- Migration: `migrations/<timestamp>_add-role-to-users.js`
- `src/repositories/UserRepository.ts` — incluir seleção/retorno de `role` e aceitar `role` em `create` (mas com default em serviço)
- `src/services/CreateUserService.ts` — definir `role = 'user'` por padrão ao criar usuário
- `src/services/AuthService.ts` — incluir `role` no payload do JWT
- `src/middlewares/authorize.ts` — novo middleware utilitário para checar roles/owner
- `src/routes/userRoutes.ts` — aplicar middleware de autorização em rotas apropriadas
- `src/controllers/UserController.ts` — checagem defensiva (retornar `403` com `AppError` quando necessário)
- `src/tests/rbac.test.ts` — testes de integração cobrindo casos de aceitação

## Regras de implementação (restrições)
- Não alterar endpoints existentes.
- Não alterar fluxo de autenticação atual (apenas estender payload do JWT).
- Não alterar estrutura Docker ou PostgreSQL.
- Não refatorar módulos relacionados a Tasks.
- Trabalhar apenas no domínio Users/Auth.

## Passo a passo (fases)

### Fase 0 — Preparação (1 dia)
- Criar migration que adiciona coluna `role` em `users` com padrão `'user'`:

  SQL sugerido:

  ```sql
  ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
  ```

  Comandos:

  ```bash
  npm run migrate:create -- name=add-role-to-users
  npm run migrate:up
  ```

- Verificar se `authMiddleware` expõe `request.user.role`. Se não, planejar uma pequena alteração no middleware para carregar `role` do banco durante a verificação do JWT.

### Fase 1 — Persistência e criação (0.5 dia)
- Atualizar `UserRepository`:
  - Incluir `role` nos `SELECT` e `RETURNING` das queries `create`, `findByEmail`, `findById`, `findAll`.
- Atualizar `CreateUserService`:
  - Garantir que `role` seja definido como `'user'` na criação (serviço), não vindo do request do cliente.
- Atualizar DTOs/DTO de criação somente se necessário (não permitir `role` no payload público).

### Fase 2 — JWT e AuthService (0.5 dia)
- Atualizar `AuthService` para incluir `role` no payload dos tokens JWT:

  Exemplo de payload do `accessToken`:

  ```json
  { "userId": user.id, "role": user.role }
  ```

- Garantir que `AuthController` continue retornando `user`, `accessToken` e `refreshToken` (com o `user.role` presente no objeto `user`).

### Fase 3 — Middleware de autorização (0.5-1 dia)
- Criar `src/middlewares/authorize.ts` com funções:
  - `authorize(...roles: string[])` — permite apenas usuários cujo `request.user.role` esteja entre `roles`.
  - `ensureOwnerOrRole(role: string)` — middleware que permite se `Number(req.params.id) === request.user.id` ou `request.user.role === role`.

- O middleware deve lançar `AppError` com status `403` se não autorizado.

### Fase 4 — Aplicar proteção nas rotas (0.25 dia)
- Em `src/routes/userRoutes.ts`:
  - Proteger `GET /users` com `authorize('admin')`.
  - Proteger `PUT /users/:id` e `DELETE /users/:id` com `ensureOwnerOrRole('admin')`.
  - `GET /users/me` permanece com o `authMiddleware` existente.

### Fase 5 — Checagens defensivas em Services/Controllers (0.25 dia)
- Mesmo com middleware, adicionar validação defensiva em `UpdateUserService` e `DeleteUserService` para verificar owner/admin e retornar `AppError(403)` quando apropriado.

### Fase 6 — Testes (1 dia)
- Criar testes em `src/tests/rbac.test.ts` cobrindo:
  - Admin lista usuários → `200`.
  - User lista usuários → `403`.
  - Owner atualiza/exclui próprio perfil → `200`.
  - User tenta atualizar/excluir outro perfil → `403`.
  - JWT contém `role` no payload (verificar decodificando o token ou inspecionando `user` retornado).

- Rodar suíte de testes completa com:

  ```bash
  DB_HOST=localhost npm test -- --runInBand
  ```

- Ajustar `src/tests/setup.ts` para garantir `pool.end()` e, se necessário, executar migrations antes dos testes.

### Fase 7 — Documentação e entrega (0.25 dia)
- Atualizar `specs/002-user-authorization-rbac/spec.md` com link para implementação.
- Atualizar `.github/copilot-instructions.md` se necessário para apontar para a nova spec (opcional).

## Critérios de aceitação (técnicos)
- `GET /users` retorna `403` para `role = 'user'` e `200` para `role = 'admin'`.
- `PUT /users/:id` e `DELETE /users/:id` retornam `200` para owner e admin; `403` para outros usuários.
- Login (`POST /login`) continua funcional e `accessToken`/`refreshToken` carregam `role`.
- Migrations aplicadas corretamente sem perda de dados.

## Comandos úteis
- Criar migration:

```bash
npm run migrate:create -- name=add-role-to-users
```

- Aplicar migrations:

```bash
npm run migrate:up
```

- Rodar testes (host):

```bash
DB_HOST=localhost npm test -- --runInBand
```

## Riscos e mitigação
- Alteração no `authMiddleware` pode impactar outras partes; validar que apenas `request.user.role` é adicionado e que payload JWT continua válido.
- Migration deve usar `DEFAULT 'user'` para evitar problemas com registros existentes.
- Garantir que endpoints administrativos (se existirem em outros módulos) não sejam inadvertidamente expostos — testar manualmente.

---

**Próximo passo sugerido**: implementar a migration e atualizar o `UserRepository` para expor `role`.
