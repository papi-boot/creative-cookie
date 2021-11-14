const session = require("express-session");
const { Sequelize } = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
let seqString, seqOption;
export const sequelizeConfig = (connectionString, connectionOption) => {
  console.log(connectionString, connectionOption);
  seqString = () => connectionString;
  seqOption = () => connectionOption;
  // const cOption = { ...connectionOption, dialect: "postgres" };
  const sequelize = new Sequelize(connectionString, connectionOption);
  seq = sequelize;
};
console.log(seqString, seqOption);
export const sessionConfig = {
  // store: new SequelizeStore({
  //   db: seq,
  // }),
  secret: this.SECRET_KEY,
  saveUninitialized: false,
  resave: true,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    secure: process.env.NODE_ENV === "production" ? true : "auto",
  },
  proxy: true,
};
