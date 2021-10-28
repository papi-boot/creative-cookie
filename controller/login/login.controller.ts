import { LoginInterface } from "../interface/interface";
import { DatabaseHelper } from "../../helper/database.helper";
import { QueryTypes } from "sequelize";
import { Clean } from "../../middleware/clean";
import { UserModel } from "../../db/models/user";
import passport from "passport";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { Strategy } from "passport-local";
export class LoginController extends DatabaseHelper {
  public LOGIN_PATH: string = "/login";
  private c: Clean = new Clean();
  private loginOptions: LoginInterface = {
    page_title: "Sign in | Creative Cookie",
    paths: {
      register_path: "/register",
      self_path: this.LOGIN_PATH,
    },
  };
  public getLoginPage = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    console.log("HELLO COCONUT");

    res.status(200).render("login/index", this.loginOptions);
  };

  public passportConfig(): any {
    try {
      // @TODO: Checking Passport validation
      passport.use(
        new Strategy(
          { usernameField: "email", passwordField: "password" },
          async (email, password, done) => {
            if (!email && !password) {
              return done(null, false, {
                message: "Please provide a valid credentials.",
              });
            }
            console.log(`Email: ${email}, Password: ${password}`);
            const checkUser: Array<UserModel> =
              await this.startDatabase().db.query(
                "SELECT * FROM users WHERE user_email = $1",
                {
                  type: QueryTypes.SELECT,
                  bind: [email],
                }
              );
            console.log(checkUser);
            if (checkUser.length > 0) {
              bcrypt.compare(
                password,
                checkUser[0].user_password,
                (err, isMatched) => {
                  if (err) {
                    return console.error(err);
                  }

                  if (isMatched) {
                    return done(null, checkUser[0]);
                  } else {
                    return done(null, false);
                  }
                }
              );
            } else {
              console.error("User does not exist");
              return done(null, false);
            }
          }
        )
      );
      // @TODO: Serialize User
      passport.serializeUser((user, done) => done(null, user));
      // @TODO: Deserialize User
      passport.deserializeUser((user: any, done) => done(null, user));
    } catch (err) {
      console.error(err);
    }
  }
  public postLogin = (req: express.Request, res: express.Response) => {
    console.log(req.body);
    passport.authenticate("local", (err, user: UserModel, info) => {
      if (err) {
        throw err;
      }
      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            throw err;
          }
          req.session.cookie.sameSite = "none";
          req.session.cookie.secure = true;
          req.session.cookie.maxAge = 360 * 60 * 60 * 1000;
          return res.status(200).json({
            message: "Successfully Logged in",
            success: true,
            isAuthenticated: true,
            user: user,
            path: "/dashboard",
          });
        });
      } else {
        return res.status(401).json({
          message: "Email or Password is incorrect",
          success: false,
          isAuthenticated: false,
          user: null,
          path: "/authencate",
        });
      }
      console.log(info);
    })(req, res);
  };
}
