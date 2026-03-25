import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { normalizeDatabaseUrl } from "./src/lib/normalize-database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(env("DATABASE_URL")),
  },
});
