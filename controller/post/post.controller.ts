import { DatabaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { QueryTypes } from "sequelize";
import { PostModel } from "../../model/post";
import { PostLikeRecord } from "../../model/post-like-records";
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
        console.log(req.header("post-list"));
        const postLimit = req.header("post-list");
        const postItemResult = await this.startDatabase().db.query(
          "SELECT COUNT(*) FROM posts INNER JOIN users ON posts.post_created_by = users.user_id",
          {
            type: QueryTypes.SELECT,
          }
        );
        const results: Array<PostModel> = await this.startDatabase().db.query(
          "SELECT * FROM posts INNER JOIN users ON posts.post_created_by = users.user_id ORDER BY post_created_at DESC LIMIT $1",
          {
            type: QueryTypes.SELECT,
            bind: [postLimit],
          }
        );
        const getPostLike: Array<PostLikeRecord> =
          await this.startDatabase().db.query(
            "SELECT * FROM post_like_records INNER JOIN users ON post_like_records.plr_user_ref = users.user_id INNER JOIN posts ON post_like_records.plr_post_ref = posts.post_id",
            {
              type: QueryTypes.SELECT,
            }
          );
        if (results.length > 0) {
          // @TODO: get corresponding likes

          return res.status(200).json({
            message: "Post successfully fetched",
            success: true,
            post: results,
            post_item: postItemResult,
            post_like: getPostLike,
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
  public updatePost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { post_content, post_tag, post_id } = req.body;
        // First check the post if exist
        const checkPost: Array<PostModel> = await this.startDatabase().db.query(
          "SELECT * FROM posts WHERE post_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [post_id],
          }
        );
        if (checkPost.length > 0) {
          if (post_content) {
            // TODO: Update one post
            const cleanPostContent = await this.c.cleanContent(post_content);
            const cleanPostTag = await this.c.cleanContent(
              JSON.stringify(post_tag)
            );
            const results = await this.startDatabase().db.query(
              "UPDATE posts SET post_content = $1, post_tag = $2, post_updated_at = $3 WHERE post_id = $4 RETURNING *",
              {
                type: QueryTypes.UPDATE,
                bind: [
                  cleanPostContent,
                  post_tag ? cleanPostTag : null,
                  new Date(),
                  post_id,
                ],
              }
            );
            console.log(results);
            return res.status(200).json({
              message: "Post was successfully update.",
              success: true,
            });
          } else {
            return res
              .status(400)
              .json({ message: "Post should have a content.", success: false });
          }
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
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again or later" });
    }
  };
  public deletePost = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { post_id } = req.body;
        // @TODO: Check if post is existing
        const checkPost: Array<PostModel> = await this.startDatabase().db.query(
          "SELECT * FROM posts WHERE post_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [post_id],
          }
        );
        if (checkPost.length > 0) {
          // @TODO: delete post;
          const results = await this.startDatabase().db.query(
            "DELETE FROM posts WHERE post_id = $1 RETURNING *",
            {
              type: QueryTypes.DELETE,
              bind: [post_id],
            }
          );
          console.log(results);
          return res
            .status(200)
            .json({ message: "Post was successfully deleted", success: true });
        } else {
          return res.status(404).json({
            message:
              "The post was not found. It's either deleted or check your network to refresh all content",
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
}
