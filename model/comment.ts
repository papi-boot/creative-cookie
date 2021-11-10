import { UserModel } from "./user";
import { PostModel } from "./post";

export interface CommentModel {
  comment_id: string;
  comment_post_ref: PostModel;
  comment_user_ref: UserModel;
  comment_content: string;
  comment_created_at: Date;
  comment_updated_at: Date;
}
