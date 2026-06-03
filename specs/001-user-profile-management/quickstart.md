# quickstart.md

## How to run locally (development)

1. Install dependencies

```bash
npm install
```

2. Prepare environment (copy .env.example to .env and configure database)

3. Run database migrations

```bash
npm run migrate:up
```

4. Start development server

```bash
npm run dev
```

5. Run tests

```bash
npm test
```

Notes:
- Use `docker compose up -d` when testing integration with the project's Docker setup.
- After implementing DB schema changes, add a migration under `migrations/` and run `npm run migrate:up`.
