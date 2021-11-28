import { databaseHelper } from "../../helper/database.helper";
import { UserStatusModel } from "../../model/user-status";
import express from "express";
import { Server } from "socket.io";
import { UserModel } from "../../model/user";
import { QueryTypes } from "sequelize";
export class ActiveStatusController {
  public createUserStatus = async (userID: string | any, socket_id: string | any, res: express.Response): Promise<boolean | any> => {
    // @TODO: check user if existing;
    const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_id = $1", {
      type: QueryTypes.SELECT,
      bind: [userID],
    });
    if (checkUser.length > 0) {
      const addUserStatus = await databaseHelper.db.query(
        "INSERT INTO user_status(status_user_ref, status_is_active, status_socket_id, status_created_at, status_updated_at)VALUES($1,$2,$3,$4,$5)",
        {
          type: QueryTypes.INSERT,
          bind: [checkUser[0].user_id, true, socket_id, new Date(), new Date()],
        }
      );
      addUserStatus;
      return true;
    } else {
      return false;
    }
  };

  public updateUserStatusOffline = async (socket_id: string | any): Promise<any> => {
    try {
      // @TODO: check socket id if existing
      const checkStatusWithSocketId: Array<UserStatusModel> = await databaseHelper.db.query(
        "SELECT * FROM user_status WHERE status_socket_id = $1",
        {
          type: QueryTypes.SELECT,
          bind: [socket_id],
        }
      );
      if (checkStatusWithSocketId.length > 0) {
        const updateStatusOnline = await databaseHelper.db.query(
          "UPDATE user_status SET status_is_active = $1, status_updated_at = $2 WHERE status_socket_id = $3",
          {
            type: QueryTypes.UPDATE,
            bind: [false, new Date(), socket_id],
          }
        );
        updateStatusOnline;
      } else {
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };
}
