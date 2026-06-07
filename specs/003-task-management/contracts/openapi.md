# contracts/openapi.md — Task Management

## Authentication

All endpoints require JWT in header:

```
Authorization: Bearer <accessToken>
```

JWT payload includes `userId` and `role` (`user` | `admin`).

## Endpoints

### POST /tasks

Create a new task owned by the authenticated user.

**Request body**:

```json
{
  "title": "Minha tarefa",
  "description": "Opcional",
  "status": "pending"
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `title` | yes | Non-empty string |
| `description` | no | String |
| `status` | no | `pending` \| `in_progress` \| `completed`; default `pending` |

**Responses**:
- `201 Created` — task object
- `400 Bad Request` — validation error (missing/empty title, invalid status)
- `401 Unauthorized` — missing or invalid token

---

### GET /tasks

List all tasks owned by the authenticated user.

**Responses**:
- `200 OK` — array of task objects (may be empty)
- `401 Unauthorized`

**Note**: Admin receives only their own tasks on this endpoint.

---

### GET /tasks/:id

Retrieve a single task by id.

**Path params**: `id` — task identifier (integer)

**Responses**:
- `200 OK` — task object
- `400 Bad Request` — invalid id format (if applicable)
- `401 Unauthorized`
- `403 Forbidden` — user role `user` accessing another user's task
- `404 Not Found` — task does not exist

---

### PUT /tasks/:id

Update a task. Owner or admin only.

**Path params**: `id` — task identifier

**Request body** (at least one field):

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "status": "in_progress"
}
```

**Responses**:
- `200 OK` — updated task object (`updated_at` changed)
- `400 Bad Request` — validation error or invalid status
- `401 Unauthorized`
- `403 Forbidden` — user role `user` updating another user's task
- `404 Not Found`

---

### DELETE /tasks/:id

Delete a task permanently. Owner or admin only.

**Path params**: `id` — task identifier

**Responses**:
- `200 OK` or `204 No Content` — task deleted
- `401 Unauthorized`
- `403 Forbidden` — user role `user` deleting another user's task
- `404 Not Found`

---

## Authorization matrix

| Operation | `user` (owner) | `user` (non-owner) | `admin` |
|-----------|----------------|--------------------|---------|
| POST /tasks | ✅ | N/A | ✅ |
| GET /tasks | ✅ (own only) | N/A | ✅ (own only) |
| GET /tasks/:id | ✅ | ❌ 403 | ✅ |
| PUT /tasks/:id | ✅ | ❌ 403 | ✅ |
| DELETE /tasks/:id | ✅ | ❌ 403 | ✅ |

## Error response format

Consistent with existing API (`AppError` + `errorHandler`):

```json
{
  "error": "Mensagem descritiva"
}
```

## Swagger

Documented via JSDoc `@swagger` blocks in `src/routes/taskRoutes.ts`, tag `[Tasks]`, consumed by `src/shared/docs/swagger.ts` at `/docs`.
