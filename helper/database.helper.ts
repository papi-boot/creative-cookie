import {
  Sequelize,
  QueryTypes,
  DataTypes,
  QueryOptionsWithType,
} from "sequelize";
interface DatabaseHelperInterFace {
  db: Sequelize;
}
let connectionStringOption = {};
let connectionString;
const isProduction = process.env.NODE_ENV === "production";

//Check if we are on production mode or development mode
if (isProduction) {
  connectionString = process.env.DATABASE_URL;
  connectionStringOption = {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  };
} else {
  connectionString = process.env.DATABASE_URL;
  connectionStringOption = {
    dialect: "postgres",
    logging: false,
  };
}
console.log(connectionStringOption);

const sequelize = new Sequelize(connectionString!, connectionStringOption);

try {
  sequelize
    .authenticate()
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.error(err));
} catch (err) {
  console.error(err);
}
export const databaseHelper: DatabaseHelperInterFace = {
  db: sequelize,
};
