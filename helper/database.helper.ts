import { Sequelize, QueryTypes, QueryInterface } from "sequelize";
interface ConnectionOption {
  dialect: string;
  dialectOptions: object | undefined;
  logging: boolean;
}
interface ReturnOption {
  db: Sequelize;
  qt?: any;
}
export class DatabaseHelper {
  public connectionString: any = "";
  public connectionOption: ConnectionOption | any = {
    dialect: "",
    dialectOptions: undefined,
    logging: false,
  };
  private dialect = "postgres";
  public startDatabase(): ReturnOption {
    if (process.env.NODE_ENV === "production") {
      this.connectionString = process.env.DATABASE_URL;
      this.connectionOption = {
        dialect: this.dialect,
        logging: false,
      };
    } else {
      this.connectionString = process.env.DATABASE_URL;
      this.connectionOption = {
        dialect: this.dialect,
        dialectOptions: undefined,
        logging: false,
      };
    }
    const sequelize = new Sequelize(
      this.connectionString,
      this.connectionOption
    );
    sequelize
      .authenticate()
      .then(() => {
        console.log("CONNECTED TO DATABASE");
      })
      .catch((err) => {
        console.error(err);
      });

    return { db: sequelize, qt: QueryTypes };
  }
}
