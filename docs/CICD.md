# CI/CD — LocalBoost

## Pipeline GitHub Actions

Déclenché sur chaque push sur `main`, `develop` ou `feature/**`.

### Jobs CI (`ci.yml`)

| Job | Description |
|-----|-------------|
| `ci` | Installation des dépendances |
| `build` | Build TypeScript frontend + backend |
| `test` | Tests unitaires Jest (coverage ≥ 60%) |
| `security` | npm audit --audit-level=high |

### Déploiement

| Workflow | Cible | Branche |
|----------|-------|---------|
| `deploy-vercel.yml` | Frontend → Vercel | main |
| `deploy-railway.yml` | Backend → Railway | main |

## Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Token d'authentification Vercel |
| `VERCEL_ORG_ID` | ID de l'organisation Vercel |
| `VERCEL_PROJECT_ID` | ID du projet Vercel |
| `RAILWAY_TOKEN` | Token d'authentification Railway |

## Stratégie de branches
main          ← production (déploiement Vercel + Railway)
└── develop   ← intégration (merge en fin de sprint)
└── feature/xxx  ← branches de développement

## URLs de déploiement

- Frontend : https://localboost-frontend.vercel.app
- Backend : Railway (service backend)
