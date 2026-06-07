# quickstart.md — Task Management

Guia de validação end-to-end para a feature Task Management (Phase 4).

## Prerequisites

- Node.js >= 18
- PostgreSQL acessível (local ou via Docker)
- `.env` configurado (copiar de `.env.example`)
- Migrations aplicadas, incluindo `align-tasks-schema`

## Setup

```bash
npm install
npm run migrate:up
npm run build
docker compose down
docker compose build --no-cache
docker compose up -d
```

API disponível em `http://localhost:3333`. Swagger em `http://localhost:3333/docs`.

## Obtain tokens

1. Criar usuário comum:

```bash
curl -s -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"User A","email":"usera@example.com","password":"secret123"}'
```

2. Login e guardar token:

```bash
TOKEN_USER=$(curl -s -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@example.com","password":"secret123"}' | jq -r '.accessToken')
```

3. Repetir para um segundo usuário (`userb@example.com`) e para um admin (ajustar `role` no banco ou usar seed existente).

## Validation scenarios

### SC-1: Create task (201)

```bash
curl -s -X POST http://localhost:3333/tasks \
  -H "Authorization: Bearer $TOKEN_USER" \
  -H "Content-Type: application/json" \
  -d '{"title":"Primeira tarefa","description":"Teste"}' | jq
```

**Expected**: `201`, `status: "pending"`, `user_id` igual ao usuário autenticado.

### SC-2: List own tasks (200)

```bash
curl -s http://localhost:3333/tasks \
  -H "Authorization: Bearer $TOKEN_USER" | jq
```

**Expected**: `200`, array contendo apenas tarefas do owner.

### SC-3: Get task by id (200 / 403 / 404)

```bash
TASK_ID=1
curl -s http://localhost:3333/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_USER" | jq
```

- Owner → `200`
- Outro user com token diferente → `403`
- ID inexistente → `404`

### SC-4: Update task (200)

```bash
curl -s -X PUT http://localhost:3333/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_USER" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}' | jq
```

**Expected**: `200`, `status: "in_progress"`, `updated_at` posterior a `created_at`.

### SC-5: Delete task (200/204)

```bash
curl -s -X DELETE http://localhost:3333/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_USER" -w "\nHTTP %{http_code}\n"
```

**Expected**: sucesso; `GET /tasks/$TASK_ID` subsequente retorna `404`.

### SC-6: Unauthenticated (401)

```bash
curl -s http://localhost:3333/tasks -w "\nHTTP %{http_code}\n"
```

**Expected**: `401`.

### SC-7: Invalid input (400)

```bash
curl -s -X POST http://localhost:3333/tasks \
  -H "Authorization: Bearer $TOKEN_USER" \
  -H "Content-Type: application/json" \
  -d '{"title":""}' -w "\nHTTP %{http_code}\n"
```

**Expected**: `400`.

### SC-8: Admin bypass

Com token de admin, acessar `GET/PUT/DELETE /tasks/:id` de tarefa pertencente a outro usuário.

**Expected**: `200` (não `403`).

## Automated tests

```bash
DB_HOST=localhost npm test -- --runInBand --testPathPattern=tasks
```

**Expected**: todos os cenários de CRUD e autorização passando.

## References

- Data model: [data-model.md](../data-model.md)
- API contract: [contracts/openapi.md](../contracts/openapi.md)
- Feature spec: [spec.md](../spec.md)
