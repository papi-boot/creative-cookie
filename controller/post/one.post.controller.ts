import { databaseHelper } from "../../helper/database.helper";
import { QueryTypes } from "sequelize";
import { PostModel } from "../../model/post";
import { CommentModel } from "../../model/comment";
import { PostLikeRecord } from "../../model/post-like-records";
import express from "express";

export class OnePostController {
  public ONE_POST_ROUTE: string = "/one-post";
  public readOnePost = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        const { post_id } = req.body;
        const { user_id } = req.session.user;
        // @TODO: check post if existing
        const checkPost: Array<PostModel> = await databaseHelper.db.query("SELECT * FROM posts WHERE post_id = $1", {
          type: QueryTypes.SELECT,
          bind: [post_id],
        });
        if (checkPost.length > 0) {
          const getOnePost: Array<PostModel> = await databaseHelper.db.query(
            "SELECT * FROM posts INNER JOIN users ON posts.post_created_by = users.user_id WHERE post_id = $1",
            {
              type: QueryTypes.SELECT,
              bind: [checkPost[0].post_id],
            }
          );
          const getPostLike: Array<PostLikeRecord> = await databaseHelper.db.query(
            "SELECT * FROM post_like_records INNER JOIN users ON post_like_records.plr_user_ref = users.user_id WHERE plr_post_ref = $1 ORDER BY plr_created_at DESC",
            {
              type: QueryTypes.SELECT,
              bind: [post_id],
            }
          );
          const getPostComment: Array<CommentModel> = await databaseHelper.db.query(
            "SELECT * FROM comments INNER JOIN users ON comments.comment_user_ref = users.user_id WHERE comment_post_ref = $1 ORDER BY comment_created_at DESC",
            {
              type: QueryTypes.SELECT,
              bind: [getOnePost[0].post_id],
            }
          );
          return res
            .status(200)
            .json({ message: "One Post Fetched!", success: true, post: getOnePost, post_like: getPostLike, post_comment: getPostComment });
        } else {
          return res.status(404).json({ message: "The post was not found. It's either deleted or remove by the admin", success: false });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
