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