import path from "path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import flash from "express-flash";
import passport from "passport";

declare module "express-session" {
  interface SessionData {
    user?: object;
  }
}
export class ServerHelper {
  public app: express.Application = express();
  private SECRET_KEY: any = process.env.SECRET_KEY;

  public startMiddleWare(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        credentials: true,
        origin: "*",
      })
    );
    this.app.use(express.static("public"));
    this.app.set("view engine", "ejs");
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.use(
      session({
        secret: this.SECRET_KEY,
        saveUninitialized: false,
        resave: true,
      })
    );
    this.app.use(flash());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
