# data-model.md — Task Management

## Task entity

**Entity**: Task

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | integer (serial) | auto | Primary key |
| `title` | varchar(255) | yes | Non-empty after trim |
| `description` | text | no | Optional; may be null or empty |
| `status` | varchar(20) | yes | Enum: `pending`, `in_progress`, `completed`; default `pending` |
| `user_id` | integer | yes | FK → `users.id`, `ON DELETE CASCADE` |
| `created_at` | timestamp | auto | Set on insert |
| `updated_at` | timestamp | auto | Set on insert; updated on every UPDATE |

### Validation rules (Zod)

**CreateTaskSchema**:
- `title`: string, min length 1 after trim
- `description`: string, optional
- `status`: enum [`pending`, `in_progress`, `completed`], optional (default `pending` in service)

**UpdateTaskSchema**:
- `title`: string, min length 1 after trim, optional
- `description`: string, optional
- `status`: enum [`pending`, `in_progress`, `completed`], optional
- At least one field must be provided

### State transitions

```text
pending ──► in_progress ──► completed
   │              │              │
   └──────────────┴──────────────┘
         (any valid status → any valid status via update)
```

No restriction on backward transitions (e.g., `completed` → `pending`) unless added in a future feature.

### Relationships

- **Task → User**: many-to-one (`tasks.user_id` → `users.id`)
- **User → Task**: one-to-many (a user owns zero or more tasks)

### Indexes and constraints

- Primary key on `id`
- Foreign key `user_id` references `users(id)` with `ON DELETE CASCADE`
- Check constraint on `status` IN (`pending`, `in_progress`, `completed`)
- Recommended index: `tasks(user_id)` for list-by-owner queries (optional; evaluate if list performance degrades)

### API response shape

Fields returned in task responses (no sensitive fields):

```json
{
  "id": 1,
  "title": "Implementar login",
  "description": "Detalhes opcionais",
  "status": "pending",
  "user_id": 42,
  "created_at": "2026-06-07T12:00:00.000Z",
  "updated_at": "2026-06-07T12:00:00.000Z"
}
```

### Schema migration note

Current table (`1776500000000_create-tasks.js`) has `completed: boolean` and lacks `updated_at`. Migration `align-tasks-schema` must:
1. Drop `completed`
2. Add `status` with default `pending`
3. Add `updated_at`
