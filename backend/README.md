# Sprint 1 :
Setup Node.js / Express.js + architecture modulaire & Schéma PostgreSQL
### LB-126 → LB-129
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
### LB-130 → LB-134
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
### LB-152 → LB-158
API REST — CRUD commerces, utilisateurs, catégories, régions
- GET /api/v1/businesses
Retourne tous les commerces
- GET /api/v1/businesses/search?q=restaurant
- GET /api/v1/businesses/near?lat=35&lng=-5&distance=10

### LB-159 → LB-162
Register → hash password → save user
Login → verify password → generate:
   - accessToken (15min)
   - refreshToken (7 days)

Protected route:
   Header: Authorization: Bearer TOKEN

Refresh:
   send refreshToken → get new accessToken
---
---
## 📋 Liste complète des routes API LocalBoost

### 🔐 **Authentication** (`/api/v1/auth`)
```
| Méthode | Route | Description | Auth | Body |
|---------|-------|-------------|------|------|
| **POST** | `/register` | Créer un nouvel utilisateur | ❌ | `{ "email", "password", "role" }` |
| **POST** | `/login`    | Connexion utilisateur       | ❌ | `{ "email", "password" }` |
| **POST** | `/refresh`  | Rafraîchir le token         | ❌ | `{ "refreshToken" }` |
```
---

### 👥 **Users** (`/api/v1/users`)
```
| Méthode | Route | Description | Auth | Restrictions |
|---------|-------|-------------|------|-------------|
| **GET** | `/`   | Récupérer tous les utilisateurs | ✅ | Admin only |
| **GET** | `/:id`| Récupérer un utilisateur | ✅ | User sees own, Admin sees all |
| **POST** | `/`  | Créer un utilisateur | ✅ | Admin only |
| **PUT** | `/:id`| Modifier un utilisateur | ✅ | User modifies own, Admin modifies all |
| **DELETE** | `/:id` | Supprimer un utilisateur | ✅ | Admin only |
```
---

### 🏢 **Businesses** (`/api/v1/businesses`)
```
| Méthode | Route | Description | Auth | Query Params |
|---------|-------|-------------|------|------------|
| **GET** | `/` | Récupérer toutes les entreprises | ❌ | - |
| **GET** | `/search` | Recherche full-text | ❌ | `?q=searchterm` |
| **GET** | `/near` | Filtrer par localisation (Haversine) | ❌ | `?lat=48.8&lng=2.3&distance=10` |
```
---

### 📂 **Categories** (`/api/v1/categories`)
```
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| **GET** | `/` | Récupérer toutes les catégories | ❌ |
```
---

### ⭐ **Reviews** (`/api/v1/reviews`)
```
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| **GET** | `/` | Récupérer tous les avis | ❌ |
```
---

## 🧪 **Exemples de test avec Postman**

### 1️⃣ **Inscription**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```
**Response**: `{ "id": 3, "email": "...", "password_hash": "...", "role": "user", ... }`

---

### 2️⃣ **Connexion**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Response**: `{ "accessToken": "eyJ...", "refreshToken": "eyJ..." }`

---

### 3️⃣ **Rafraîchir le Token**
```
POST http://localhost:5000/api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}
```
**Response**: `{ "accessToken": "eyJ..." }`

---

### 4️⃣ **Récupérer les Entreprises**
```
GET http://localhost:5000/api/v1/businesses
```
**Response**: Array of businesses with category and user info

---

### 5️⃣ **Recherche Entreprises**
```
GET http://localhost:5000/api/v1/businesses/search?q=restaurant
```
**Response**: Filtered businesses matching search

---

### 6️⃣ **Entreprises à proximité**
```
GET http://localhost:5000/api/v1/businesses/near?lat=48.8566&lng=2.3522&distance=5
```
**Response**: Businesses within 5 km of coordinates

---

### 7️⃣ **Consulter le profil (Protégé)**
```
GET http://localhost:5000/api/v1/users/3
Authorization: Bearer eyJ...

```
**Response**: User profile

---

### 8️⃣ **Tous les utilisateurs (Admin)**
```
GET http://localhost:5000/api/v1/users
Authorization: Bearer eyJ... (admin token)
```
**Response**: All users array

---

### 9️⃣ **Récupérer les Catégories**
```
GET http://localhost:5000/api/v1/categories
```
**Response**: Array of categories

---

### 🔟 **Récupérer les Avis**
```
GET http://localhost:5000/api/v1/reviews
```
**Response**: `{ message: "Get all reviews" }`