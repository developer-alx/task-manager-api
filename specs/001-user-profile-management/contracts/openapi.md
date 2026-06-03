# contracts/openapi.md

## Endpoints (summary)

1) GET /users
- Description: List all users. Protected; only `admin` role allowed.
- Response: 200 OK — array of users (exclude `password` field).

2) GET /users/:id
- Description: Return user by id. Allowed for the user themself or `admin`.
- Response: 200 OK — user object (exclude `password`); 404 if not found; 401/403 as applicable.

3) PUT /users/:id
- Description: Update user profile. Allowed for the user themself or `admin`.
- Request body: fields allowed to change (e.g., `name`, `email`). Do not accept `role` from non-admins or `password` here unless explicit password-change flow exists.
- Response: 200 OK — updated user object (exclude `password`).

4) DELETE /users/:id
- Description: Delete user. Allowed for the user themself or `admin` (policy decision: soft vs hard delete).
- Response: 204 No Content on success; 404 if not found; 403 if unauthorized.

Auth: All endpoints require JWT in `Authorization: Bearer <token>` header. Authorization decisions use JWT payload `id` and `role`.

Example user response schema (fields returned):

```
{
  id: number,
  name: string,
  email: string,
  role: string,
  created_at: string,
  updated_at: string
}
```
