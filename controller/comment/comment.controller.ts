import { databaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { QueryTypes } from "sequelize";
import { CommentModel } from "../../model/comment";
import { PostModel } from "../../model/post";
import express from "express";
export class CommentController {
  public COMMENT_ROUTE: string = "/comment";
  private c: Clean = new Clean();
  public createComment = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      if (req.session.user) {
        // TODO: Check if post is exisiting
        const { post_id, comment_content } = req.body;
        const { user_id } = req.session.user;
        const checkPost: Array<PostModel> = await databaseHelper.db.query(
          "SELECT * FROM posts WHERE post_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [post_id],
          }
        );
        if (checkPost.length > 0) {
          // Insert a comment for specific post
          const cleanCommentContent = await this.c.cleanContent(
            comment_content
          );
          const results = await databaseHelper.db.query(
            "INSERT INTO comments(comment_post_ref, comment_user_ref, comment_content, comment_created_at, comment_updated_at)VALUES($1,$2,$3,$4,$5) RETURNING *",
            {
              type: QueryTypes.INSERT,
              bind: [
                checkPost[0].post_id,
                user_id,
                cleanCommentContent,
                new Date(),
                new Date(),
              ],
            }
          );
          console.log(results);
          return res
            .status(200)
            .json({ message: "Comment Added.", success: true });
        } else {
          return res.status(404).json({
            message:
              "The post was not found. It's either deleted or check your network to refresh all content",
            success: false,
          });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };

  public readComment = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      if (req.session.user) {
        
      } else {
        return res.status(401).json({message: "Not Authorized", success: false});
      }
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({
          message: "Something went wrong. Please try again later",
          success: true,
        });
    }
  };
}