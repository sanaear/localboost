# Guide de déploiement — LocalBoost

## Environnements

| Environnement | Frontend (Vercel) | Backend (Railway) | Branche |
|---|---|---|---|
| Development | localhost:3000 | localhost:3001 | feature/** |
| Staging | Preview URL Vercel | Railway staging | develop |
| Production | localboost-frontend.vercel.app | Railway production | main |

## Variables d'environnement

Copie `.env.example` en `.env` et remplis les valeurs :
```bash
cp .env.example .env
```

Ne jamais commiter `.env` — il est dans `.gitignore`.

## Procédure de déploiement

### Staging
```bash
git push origin develop
# → Vercel preview + Railway staging se déploient automatiquement
```

### Production
```bash
# Créer une PR develop → main sur GitHub
# Après merge :
# → Vercel production + Railway production se déploient automatiquement
```

## Secrets GitHub Actions requis

| Secret | Utilisation |
|---|---|
| `VERCEL_TOKEN` | Déploiement Vercel |
| `VERCEL_ORG_ID` | Identification organisation |
| `VERCEL_PROJECT_ID` | Identification projet |
| `RAILWAY_TOKEN` | Déploiement Railway |