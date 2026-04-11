## API LocalBoost
### Structure
- modules/:     architecture par domaine
- middlewares/: middlewares globaux
- config/:      Configuration Base de données
### Routes
- /api/auth
- /api/users
- /api/businesses
### Stack
- Node.js
- Express.js

## Database Schema
### Tables
- users
- businesses
- reviews
- categories
- analytics_events
- translations_cache
- inactivity_tracking
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