import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });
let databaseConfig: { development: object; production: object };
const DATABASE_DIALECT = "postgres";
export default databaseConfig = {
  development: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    dialect: DATABASE_DIALECT
  },
  production: {},
};
