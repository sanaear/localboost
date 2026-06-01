# LocalBoost

LocalBoost is a monorepo with three main parts:

- `backend`: Express API, Prisma, PostgreSQL, local AI/recommendation routes, uploads, admin/merchant APIs
- `frontend`: desktop/admin web app
- `frontend-mobile`: mobile tourist and merchant web app

## Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop
- Git

## Fresh Machine Setup

Clone the repository and install all workspace dependencies:

```bash
git clone <your-github-repo-url>
cd localboost
npm install
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

## Environment Files

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localboost:localboost@localhost:5432/localboost
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
EMAIL_USER=
EMAIL_PASS=
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Create `frontend-mobile/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DESKTOP_URL=http://localhost:3000
```

Optional mobile image optimization:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Cloudinary is optional. Local uploaded images are served directly by the backend from `http://localhost:5000/uploads/...`.

## Database

Create the Prisma schema in PostgreSQL:

```bash
npm run db:push
```

Seed demo data:

```bash
npm run db:seed
```

Seeded demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@localboost.dev` | `admin123` |
| Merchant | `merchant@localboost.dev` | `merchant123` |
| Tourist | `tourist@localboost.dev` | `tourist123` |

## Run The Project

Open three terminals.

Terminal 1, backend API:

```bash
npm run dev:backend
```

Backend runs at:

```text
http://localhost:5000
```

Terminal 2, desktop/admin app:

```bash
npm run dev:frontend -- --port 3000
```

Desktop/admin app runs at:

```text
http://localhost:3000
```

Terminal 3, mobile tourist/merchant app:

```bash
npm run dev:frontend:mobile -- --port 3001
```

Mobile app runs at:

```text
http://localhost:3001
```

## Useful URLs

- Admin portal: `http://localhost:3000/en/admin`
- Mobile/tourist app: `http://localhost:3001/en`
- Merchant dashboard: `http://localhost:3001/en/merchant/dashboard`
- Merchant stats: `http://localhost:3001/en/merchant/stats`
- AI health check: `http://localhost:5000/api/v1/ai/health`

## Build And Test

Build all workspaces:

```bash
npm run build:all
```

Build one workspace:

```bash
npm run build -w backend
npm run build -w frontend
npm run build -w frontend-mobile
```

Run tests:

```bash
npm test
```

Or run tests per workspace:

```bash
npm run test:backend
npm run test:frontend
npm test -w frontend-mobile
```

## Important Notes

- The main application database is PostgreSQL through Prisma.
- `backend/localboost.db` is a local SQLite file used by older/local AI helper modules. Do not rely on it as the main app database.
- Uploaded images are stored under `backend/src/modules/ai2/uploads` and served by Express at `/uploads`.
- If you want demo uploaded images to appear on another machine, commit selected sample images in the uploads folder or upload new images through the app after setup.
- The backend API prefix is `/api/v1`.
- The frontend apps expect `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` in local development.

## Common Startup Problems

If Prisma cannot connect, make sure Docker is running and PostgreSQL is up:

```bash
docker compose ps
```

If ports are already used, stop the old process or choose a different port:

```bash
npm run dev:frontend -- --port 3002
npm run dev:frontend:mobile -- --port 3003
```

If uploaded images do not appear, check that the backend is running and the image URL starts with:

```text
http://localhost:5000/uploads/
```

