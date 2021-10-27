require("dotenv").config();
const DATABASE_DIALECT = "postgres";
module.exports = {
  development: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    dialect: DATABASE_DIALECT,
  },
  production: {
    // use_env_variable: "DATABASE_URL",
    username: process.env.PG_DEV_USERNAME,
    password: process.env.PG_DEV_PASSWORD,
    host: process.env.PG_DEV_HOST,
    database: process.env.PG_DEV_DATABASE,
    port: process.env.PG_DEV_PORT,
    dialect: DATABASE_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
