import { envs } from "./src/core/config/envs.js";

export default {
  development: {
    client: "pg",
    connection: {
      host: envs.DB_HOST,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      port: envs.DB_PORT,
    },
    migrations: {
      directory: [
        "./src/features/employees/migrations",
        "./src/features/requests/migrations",
        "./src/features/users/migrations"
      ]
    },
    seeds: {
      directory: "./src/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: {
      host: envs.DB_HOST,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      port: envs.DB_PORT,
    },
    migrations: {
      directory: [
        "./src/features/employees/migrations",
        "./src/features/requests/migrations",
        "./src/features/users/migrations"
      ]
    },
    seeds: {
      directory: "./src/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
