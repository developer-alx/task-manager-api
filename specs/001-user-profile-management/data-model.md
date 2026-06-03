# data-model.md

## User entity

Entity: User

- `id` (number) — primary key
- `name` (string) — display name
- `email` (string) — unique, validated
- `password` (string) — hashed, never returned in API responses
- `role` (string) — e.g., `user` | `admin` (default `user`)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Validation rules (suggested `zod` schemas):

- Create/Update payload: `name` optional, `email` optional but must be valid if provided; `password` optional (handled separately) — do not accept `role` from non-admins.

Indexes & constraints:

- Unique index on `email`.

Notes:

- Consider adding `deleted_at` (soft delete) if deletion should be reversible; default scope should exclude soft-deleted records when listing.
