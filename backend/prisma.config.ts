import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

process.env.DATABASE_URL ??= 'postgresql://localboost:localboost@localhost:5432/localboost';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
