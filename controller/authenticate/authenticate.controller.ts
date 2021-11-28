import express from "express";
import { QueryTypes } from "sequelize";
import { databaseHelper } from "../../helper/database.helper";
import { UserModel } from "../../model/user";
import { socketID } from "../../helper/server.helper";
import { UserStatusModel } from "../../model/user-status";
import { ActiveStatusController } from "../active-status/active.status.controller";
export class AuthenticateController {
  public AUTHENTICATE_ROUTE: string = "/authenticate";
  public LOGOUT_ROUTE: string = "/logout";
  private activeStatusController: ActiveStatusController = new ActiveStatusController();
  public checkAuthenticate = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        // console.log(req.session);
        const { user_full_name, user_id } = req.session.user;
        const getUserInfo: Array<UserModel> = await databaseHelper.db.query(
          "SELECT * FROM users LEFT JOIN profile_informations ON users.user_id = profile_informations.prof_info_user_ref LEFT JOIN user_status ON users.user_id = user_status.status_user_ref WHERE user_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [user_id],
          }
        );
        // @TODO: check if active is existing
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
        } else {
          await this.activeStatusController.createUserStatus(user_id, socketID, res);
        }
        return res.status(200).json({
          message: `Welcome Back ${user_full_name}`,
          success: true,
          isAuthenticated: true,
          user: getUserInfo[0],
        });
      } else {
        return res.status(200).json({
          message: `Session Expired`,
          success: false,
          isAuthenticated: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };

  public logOutUser = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
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
              bind: [false, socketID, new Date(), user_id],
            }
          );
          preUpdateUserStatus;
        }
        req.session.user = null;
        req.session.resetMaxAge();
        req.logOut();
        req.session.destroy((err) => {
          if (err) {
            throw err;
          }
        });
        return res.status(200).json({
          message: "Successfully Logout",
          success: true,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };
}
