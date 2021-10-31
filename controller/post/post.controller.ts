import { DatabaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { QueryTypes } from "sequelize";
import { PostModel } from "../../model/post";
import express from "express";
export class PostController extends DatabaseHelper {
  public POST_ROUTE: string = "/post";
  private c: Clean = new Clean();
  public createPost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { post_content, post_tag } = req.body;
        // TODO: create new post, clean first the content for X-CROSS Script
        if (post_content) {
          const cleanPostContent = await this.c.cleanContent(post_content);
          const cleanPostTag = await this.c.cleanContent(
            JSON.stringify(post_tag)
          );
          const results = await this.startDatabase().db.query(
            "INSERT INTO posts(post_created_by, post_content, post_tag, post_created_at, post_updated_at)VALUES($1, $2, $3, $4, $5)RETURNING *",
            {
              type: QueryTypes.INSERT,
              bind: [
                req.session.user.user_id,
                cleanPostContent,
                post_tag ? cleanPostTag : null,
                new Date(),
                new Date(),
              ],
            }
          );
          results;
          console.log(results);
          return res.status(200).json({
            message: "Your post was successfully published.",
            success: true,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Post should have a content.", success: false });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again or later" });
    }
  };
  public readPost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const results: Array<PostModel> = await this.startDatabase().db.query(
          "SELECT * FROM posts INNER JOIN users ON posts.post_created_by = users.user_id ORDER BY post_created_at DESC",
          {
            type: QueryTypes.SELECT,
          }
        );
        if (results.length > 0) {
          return res.status(200).json({
            message: "Post successfully fetched",
            success: true,
            post: results,
          });
        } else {
          return res
            .status(200)
            .json({ message: "No available post", success: false, post: null });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Not Authorized", success: false });
      }
    } catch (err) {}
  };
  public updatePost = async (req: express.Request, res: express.Response) => {};
  public deletePost = async (req: express.Request, res: express.Response) => {};
}
