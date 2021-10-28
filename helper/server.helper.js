import { DatabaseHelper } from "./database.helper";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import passport from "passport";
import { Sequelize } from "sequelize";
const SequelizeStore = require("connect-session-sequelize")(session.Store);
let dbOption = {
  connectionString: "",
  connectionOption: {},
};
if (process.env.NODE_ENV === "production") {
  dbOption.connectionString = process.env.DATABASE_URL;
  dbOption.connectionOption = {
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
  dbOption.connectionString = process.env.DATABASE_URL;
  dbOption.connectionOption = {
    dialect: "postgres",
    logging: false,
  };
}
const sequelize = new Sequelize(
  dbOption.connectionString,
  dbOption.connectionOption
);

export class ServerHelper {
  app = express();
  SECRET_KEY = process.env.SECRET_KEY;

  startMiddleWare() {
    this.app.use(express.json());
    this.app.use(
      cors({
        credentials: true,
        origin:
          process.env.NODE_ENV === "production"
            ? "https://www.creative-cookie.studio"
            : "http://localhost:3000",
        allowedHeaders: [
          "Access-Control-Allow-Credentials",
          "Content-Type",
          "Access-Control-Allow-Headers",
          "Origin",
          "X-Requested-With",
          "Content-Type, Accept",
          "Set-Cookie"
        ],

      })
    );
    this.app.use(express.static("public"));
    this.app.set("view engine", "ejs");
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.set("trust proxy", 1);
    this.app.use(
      session({
        store: new SequelizeStore({
          db: sequelize,
        }),
        secret: this.SECRET_KEY,
        saveUninitialized: false,
        resave: true,
        cookie: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : true,
          secure: process.env.NODE_ENV === "production" ? true : "auto",
        },
      })
    );
    sequelize.sync();
    this.app.use(flash());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use((req, res, next) => {
      res.header("Content-Type", "application/json;charset=UTF-8");
      res.header("Access-Control-Allow-Credentials", true);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }
}
