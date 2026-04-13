# Sprint 1 :
Setup Node.js / Express.js + architecture modulaire & Schéma PostgreSQL
## API LocalBoost
### Structure
- modules/:     architecture par domaine
- middlewares/: middlewares globaux
- config/:      Configuration Base de données
### Routes
- /api/v1/auth
- /api/v1/users
- /api/v1/businesses
### Stack
- Node.js
- Express.js

## Database Schema
### Tables
- User
- Business
- Review
- Category
- Analytics_events
- Translations_cache
- InactivityTracking
### ORM
- Prisma
### Commands
```
Install :
    => express, cors, dotenv, morgan, express-rate-limit, nodemon, prisma, @prisma/client, ioredis
Migration:
    npx prisma migrate dev
Run studio:
    npx prisma studio 
```
### Redis
```Used for caching translations & queries```

# Sprint 2 : 
API REST — CRUD commerces, utilisateurs, catégories, régions
### GET /api/v1/businesses
Retourne tous les commerces

### GET /api/v1/businesses/search?q=restaurant

### GET /api/v1/businesses/near?lat=35&lng=-5&distance=10