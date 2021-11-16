import { databaseHelper } from "../../helper/database.helper";
import { NotificationModel } from "../../model/notification";
import express from "express";
import { QueryTypes } from "sequelize";

export class NotificationController {
  public NOTIIFICATION_ROUTE: string = "/notification";
  public createNotification = async (notifPostRefID: string, notifUserRefID: string, notifType: string): Promise<boolean> => {
    switch (notifType) {
      case "Like":
        // @TODO: check if notif is already recorded
        const checkNotifLikeRecord: Array<NotificationModel> = await databaseHelper.db.query(
          "SELECT * FROM notifications WHERE notif_type = $1 AND notif_user_ref = $2 AND notif_post_ref = $3",
          {
            type: QueryTypes.SELECT,
            bind: [notifType, notifUserRefID, notifPostRefID],
          }
        );
        if (checkNotifLikeRecord.length === 0) {
          const results = await databaseHelper.db.query(
            "INSERT into notifications(notif_type, notif_is_open, notif_post_ref, notif_user_ref, notif_created_at, notif_updated_at)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
            {
              type: QueryTypes.INSERT,
              bind: [notifType, false, notifPostRefID, notifUserRefID, new Date(), new Date()],
            }
          );
          console.log(results);
        } else {
          return true;
        }
        break;
      case "Comment":
        // @TODO: check if notif is already recorded
        const results = await databaseHelper.db.query(
          "INSERT into notifications(notif_type, notif_is_open, notif_post_ref, notif_user_ref, notif_created_at, notif_updated_at)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
          {
            type: QueryTypes.INSERT,
            bind: [notifType, false, notifPostRefID, notifUserRefID, new Date(), new Date()],
          }
        );
        console.log(results);

        break;
      default:
        return true;
    }
    return true;
  };
  public readNotification = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        const results: Array<NotificationModel> = await databaseHelper.db.query(
          "SELECT * FROM notifications INNER JOIN users ON notifications.notif_user_ref = users.user_id INNER JOIN posts ON notifications.notif_post_ref = posts.post_id ORDER BY notif_created_at DESC",
          {
            type: QueryTypes.SELECT,
          }
        );
        return res.status(200).json({ message: "Notification fetch", success: true, notification: results });
      } else {
        return res.status(401).json({ message: "Not authorized", success: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
