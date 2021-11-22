import { databaseHelper } from "../../helper/database.helper";
import { QueryTypes } from "sequelize";
import { PostModel } from "../../model/post";
import { PostLikeRecord } from "../../model/post-like-records";
import { NotificationController } from "../notification/notification.controller";
import express from "express";
export class LikeController {
  public LIKE_ROUTE: string = "/post-like";
  private notificationController: NotificationController = new NotificationController();
  public createLikePost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { post_id, plr_status } = req.body;
        // @TODO: check post if existing
        const checkPost: Array<PostModel> = await databaseHelper.db.query("SELECT * FROM posts WHERE post_id = $1", {
          type: QueryTypes.SELECT,
          bind: [post_id],
        });
        if (checkPost.length > 0) {
          // CHECK IF USER ALREADY GIVE LIKE
          const { user_id } = req.session.user;
          const checkLikeStatus: Array<PostLikeRecord> = await databaseHelper.db.query(
            "SELECT * FROM post_like_records WHERE plr_post_ref = $1 AND plr_user_ref = $2",
            {
              type: QueryTypes.SELECT,
              bind: [post_id, user_id],
            }
          );
          if (checkLikeStatus.length > 0) {
            // DELETE like
            const deleteLikeStatus = await databaseHelper.db.query("DELETE FROM post_like_records WHERE plr_id = $1 RETURNING *", {
              type: QueryTypes.DELETE,
              bind: [checkLikeStatus[0].plr_id],
            });
            console.log(deleteLikeStatus);
            return res.status(200).json({ message: "Post unliked.", success: true });
          } else {
            // ADD like record for one post
            const results = await databaseHelper.db.query(
              "INSERT INTO post_like_records(plr_post_ref, plr_user_ref, plr_status, plr_created_at, plr_updated_at)VALUES($1,$2,$3,$4,$5) RETURNING *",
              {
                type: QueryTypes.INSERT,
                bind: [checkPost[0].post_id, user_id, plr_status, new Date(), new Date()],
              }
            );
            console.log(results);
            // @TODO: create notification
            await this.notificationController.createNotification(checkPost[0].post_id, user_id, "Like");
            return res.status(200).json({ message: "Post Liked.", success: true });
          }
        } else {
          return res.status(404).json({
            message: "The post was not found. It's either deleted or check your network to refresh all content",
            success: false,
          });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized" });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again later.",
        success: false,
      });
    }
  };
}
