import { databaseHelper } from "../../helper/database.helper";
import { LoginInterface } from "../interface/interface";
import { Clean } from "../../middleware/clean";
import { UserModel } from "../../model/user";
import { QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";
import express from "express";
import { socketID } from "../../helper/server.helper";
import { UserStatusModel } from "../../model/user-status";
export class LoginController {
  public LOGIN_PATH: string = "/login";
  private c: Clean = new Clean();
  private loginOptions: LoginInterface = {
    page_title: "Sign in | Creative Cookie",
    paths: {
      register_path: "/register",
      self_path: this.LOGIN_PATH,
    },
  };
  public getLoginPage = async (req: express.Request, res: express.Response): Promise<void> => {
    console.log("HELLO COCONUT");

    res.status(200).render("login/index", this.loginOptions);
  };

  public postLogin = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      // @TODO: Check if email is existing
      const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_email = $1", {
        type: QueryTypes.SELECT,
        bind: [email],
      });

      if (checkUser.length > 0) {
        // @TODO: Compare password
        bcrypt.compare(password, checkUser[0].user_password, async (err, isMatched) => {
          if (err) {
            return res.status(401).json({
              message: "Something went wrong wrong",
              success: false,
              isAuthenticated: false,
              user: null,
            });
          }
          if (isMatched) {
            req.session.user = checkUser[0];
            req.session.cookie.maxAge = 360 * 60 * 60 * 1000;
            const { user_id } = req.session.user;
            const getUserStatusActive: Array<UserStatusModel> = await databaseHelper.db.query(
              "SELECT * FROM user_status WHERE status_user_ref = $1",
              {
                type: QueryTypes.SELECT,
                bind: [user_id],
              }
            );
            if (getUserStatusActive.length > 0) {
              const preUpdateUserStatus = await databaseHelper.db.query(
                "UPDATE user_status SET status_is_active = $1, status_socket_id = $2, status_updated_at = $3 WHERE status_user_ref = $4",
                {
                  type: QueryTypes.UPDATE,
                  bind: [true, socketID, new Date(), user_id],
                }
              );
              preUpdateUserStatus;
            }
            return res.status(200).json({
              message: "Login Successfully",
              success: true,
              isAuthenticated: true,
              user: checkUser[0],
            });
          } else {
            return res.status(401).json({
              message: "Password is incorrect",
              success: false,
              isAuthenticated: false,
            });
          }
        });
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
