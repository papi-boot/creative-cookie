import { QueryTypes } from "sequelize";
import { DatabaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { PostModel } from "../../model/post";
import { PostLikeRecord } from "../../model/post-like-records";
import express from "express";
export class LikeController extends DatabaseHelper {
  public LIKE_ROUTE: string = "/post-like";
  public likePost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { post_id, plr_status } = req.body;
        // @TODO: check post if existing
        const checkPost: Array<PostModel> = await this.startDatabase().db.query(
          "SELECT * FROM posts WHERE post_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [post_id],
          }
        );
        if (checkPost.length > 0) {
          // ADD like record for one post
          const { user_id } = req.session.user;
          const results = await this.startDatabase().db.query(
            "INSERT INTO post_like_records(plr_post_ref, plr_user_ref, plr_status, plr_created_at, plr_updated_at)VALUES($1,$2,$3,$4,$5) RETURNING *",
            {
              type: QueryTypes.INSERT,
              bind: [
                checkPost[0].post_id,
                user_id,
                plr_status,
                new Date(),
                new Date(),
              ],
            }
          );
          console.log(results);
          return res
            .status(200)
            .json({ message: "Post Liked.", success: true });
        } else {
          return res.status(404).json({
            message:
              "The post was not found. It's either deleted or check your network to refresh all content",
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
