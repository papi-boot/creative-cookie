import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import { ServerHelper } from "./helper/server.helper";
import { Sequelize } from "sequelize";
import { corsOptions } from "../config/cors.option";
import { SocketListener } from "../middleware/socket.listener";
const SequelizeStore = require("connect-session-sequelize")(session.Store);
import { ActiveStatusController } from "../controller/active-status/active.status.controller";
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
const sequelize = new Sequelize(dbOption.connectionString, dbOption.connectionOption);
const sessionConfig = {
  store: new SequelizeStore({
    db: sequelize,
  }),
  secret: process.env.SECRET_KEY,
  saveUninitialized: false,
  resave: true,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    secure: process.env.NODE_ENV === "production" ? true : "auto",
  },
  proxy: true,
};
export let socketID = "";
export class ServerHelper {
  app = express();
  httpServer = createServer(this.app);
  io = new Server(this.httpServer, { cors: corsOptions });
  SECRET_KEY = process.env.SECRET_KEY;
  sl = new SocketListener();
  activeStatusController = new ActiveStatusController();

  startMiddleWare() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(cors(corsOptions));
    this.app.use(express.static("public"));
    this.app.set("view engine", "ejs");
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.set("trust proxy", 1);
    this.app.use(session(sessionConfig));
    // const sessionMiddleWare = session(sessionConfig);
    sequelize.sync();
    this.app.use(flash());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.io.on("connection", (socket) => {
      if (socket.connected) {
        socketID = socket.id;
        console.log(`A user connected ${socketID}`);
        this.sl.socketListen("pre connect", socket, this.io);
        this.sl.socketListen("user connected", socket, this.io);
        this.sl.socketListen("new post", socket, this.io);
        this.sl.socketListen("edit post", socket, this.io);
        this.sl.socketListen("delete post", socket, this.io);
        this.sl.socketListen("like post", socket, this.io);
        this.sl.socketListen("add comment", socket, this.io);
        this.sl.socketListen("edit comment", socket, this.io);
        this.sl.socketListen("delete comment", socket, this.io);
        this.sl.socketListen("user login", socket, this.io);
        this.sl.socketListen("user logout", socket, this.io);
      }
      socket.on("disconnect", async () => {
        console.log(`A user disconnected ${socket.id}`);
        this.io.emit("connect again", "Connect Again");
        await this.activeStatusController.updateUserStatusOffline(socket.id);
        this.io.emit("user disconnected", "load");
      });
    });
  }
}
