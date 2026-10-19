# helm-argocd-practice

Task Tracker: a 3-tier app (React frontend, Spring Boot backend, MySQL) built to practice **Helm**, **ArgoCD** and **Linux networking**.

This repo intentionally has **no Dockerfile, docker-compose or Kubernetes files**. Writing those is the practice.

## Stack

| Tier     | Tech                               | Default port |
|----------|------------------------------------|--------------|
| frontend | React 18 + Vite                    | 5173         |
| backend  | Java 21, Spring Boot 3.3, Maven    | 8080         |
| db       | MySQL 8                            | 3306         |

Traffic flow: browser -> frontend -> backend (`/api/*`) -> MySQL.

## Backend endpoints

| Method | Path                          | Purpose                                   |
|--------|-------------------------------|-------------------------------------------|
| GET    | `/api/tasks`                  | List tasks                                |
| POST   | `/api/tasks`                  | Create task                               |
| PUT    | `/api/tasks/{id}`             | Update task                               |
| DELETE | `/api/tasks/{id}`             | Delete task                               |
| GET    | `/api/health`                 | App + DB status (503 if DB is down)       |
| GET    | `/api/info`                   | Hostname, env, DB host/port, Java version |
| GET    | `/actuator/health/liveness`   | Liveness probe                            |
| GET    | `/actuator/health/readiness`  | Readiness probe                           |

## Configuration

All config is via environment variables. See `.env.example`.

```bash
cp .env.example .env
```

## Run locally (no Docker)

1. MySQL 8 running locally, then:
   ```bash
   mysql -u root -p < db/schema.sql
   mysql -u root -p < db/seed.sql
   mysql -u root -p -e "CREATE USER 'tasks'@'%' IDENTIFIED BY 'change-me'; GRANT ALL ON tasktracker.* TO 'tasks'@'%';"
   ```
2. Backend:
   ```bash
   set -a; source .env; set +a
   cd backend && mvn spring-boot:run
   ```
3. Frontend (reads `VITE_*` from the root `.env`):
   ```bash
   cd frontend && npm install && npm run dev
   ```

Open http://localhost:5173 and check the **Status** tab.

## Notes

- Schema is not auto-created (`ddl-auto: none`). `db/schema.sql` must run against the DB first.
- Next: read `docs/PRACTICE.md`.
