import { env } from "./env"
import { knex as setupKnex, Knex } from "knex"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const knexConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite3"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
}

export const knex = setupKnex(knexConfig)
