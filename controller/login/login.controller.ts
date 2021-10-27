import { LoginInterface } from "../interface/interface";
import { DatabaseHelper } from "../../helper/database.helper";
import { QueryTypes } from "sequelize";
import { Clean } from "../../middleware/clean";
import { UserModel } from "../../db/models/user";
import bcrypt from "bcryptjs";
import express from "express";
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

  public postLogin = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      // @TODO: Check if email is existing
      const checkUser: Array<UserModel> = await this.startDatabase().db.query(
        "SELECT * FROM users WHERE user_email = $1",
        {
          type: QueryTypes.SELECT,
          bind: [email],
        }
      );

      if (checkUser.length > 0) {
        // @TODO: Compare password
        bcrypt.compare(
          password,
          checkUser[0].user_password,
          (err, isMatched) => {
            if (err) {
              req.flash("error", err.message);
              return res.redirect(this.LOGIN_PATH);
            }
            if (isMatched) {
              req.session.user = checkUser[0];
              req.session.cookie.maxAge = 360 * 60 * 60 * 1000;
              return res.status(200).json({
                message: "Login Successfully",
                success: true,
                isAuthenticated: true,
                user: checkUser[0]
              });
            } else {
              return res.status(401).json({
                message: "Password is incorrect",
                success: false,
                isAuthenticated: false,
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          message: "The Email address does not exist",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };
}
