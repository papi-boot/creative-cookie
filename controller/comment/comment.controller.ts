import { databaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { QueryTypes } from "sequelize";
import { CommentModel } from "../../model/comment";
import { PostModel } from "../../model/post";
import { NotificationController } from "../notification/notification.controller";
import express from "express";
export class CommentController {
  public COMMENT_ROUTE: string = "/comment";
  private c: Clean = new Clean();
  private notificationController: NotificationController = new NotificationController();
  public createComment = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        // TODO: Check if post is exisiting
        const { post_id, comment_content } = req.body;
        console.log(req.body);
        const { user_id } = req.session.user;
        const checkPost: Array<PostModel> = await databaseHelper.db.query("SELECT * FROM posts WHERE post_id = $1", {
          type: QueryTypes.SELECT,
          bind: [post_id],
        });
        if (checkPost.length > 0) {
          // Insert a comment for specific post
          const cleanCommentContent = await this.c.cleanContent(comment_content);
          const results = await databaseHelper.db.query(
            "INSERT INTO comments(comment_post_ref, comment_user_ref, comment_content, comment_created_at, comment_updated_at)VALUES($1,$2,$3,$4,$5) RETURNING *",
            {
              type: QueryTypes.INSERT,
              bind: [checkPost[0].post_id, user_id, cleanCommentContent, new Date(), new Date()],
            }
          );
          await this.notificationController.createNotification(checkPost[0].post_id, user_id, "Comment");
          console.log(results);
          return res.status(200).json({ message: "Comment Added.", success: true });
        } else {
          return res.status(404).json({
            message: "The post was not found. It's either deleted or check your network to refresh all content",
            success: false,
          });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };

  public readComment = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again later",
        success: true,
      });
    }
  };
  public updateComment = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        const { comment_id, comment_content } = req.body;
        console.log(req.body);
        // @TODO: check if comment is existing
        const checkComment: Array<CommentModel> = await databaseHelper.db.query("SELECT * FROM comments WHERE comment_id = $1", {
          type: QueryTypes.SELECT,
          bind: [comment_id],
        });
        if (checkComment.length > 0) {
          const cleanEditedComment = await this.c.cleanContent(comment_content);
          const updateComment = await databaseHelper.db.query(
            "UPDATE comments SET comment_content = $1, comment_updated_at = $2 WHERE comment_id = $3 RETURNING *",
            {
              type: QueryTypes.UPDATE,
              bind: [cleanEditedComment, new Date(), checkComment[0].comment_id],
            }
          );
          console.log(updateComment);
          return res.status(200).json({ message: "Comment successfully update.", success: true });
        } else {
          return res.status(404).json({
            message: "The comment was not found. It's either deleted or check your network to refresh all content",
            success: false,
          });
        }
      } else {
        return res.status(401).json({ message: "Not Authroized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Someting went wrong. Please try again or later",
        success: false,
      });
    }
  };

  public deleteComment = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        console.log(req.body);
        const { comment_id } = req.body;
        // @TODO: check comment if existing
        const checkComment: Array<CommentModel> = await databaseHelper.db.query("SELECT * FROM comments WHERE comment_id = $1", {
          type: QueryTypes.SELECT,
          bind: [comment_id],
        });
        if (checkComment.length > 0) {
          const deleteComment = await databaseHelper.db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", {
            type: QueryTypes.DELETE,
            bind: [checkComment[0].comment_id],
          });
          console.log(deleteComment);
          return res.status(200).json({ message: "Comment deleted.", success: true });
        } else {
          return res.status(404).json({
            message: "The comment was not found. It's either deleted or check your network to refresh all content",
            success: false,
          });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
