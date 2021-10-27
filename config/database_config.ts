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
  production: {},
};
