import { UserModel } from "./user";
import { PostModel } from "./post";
export interface NotificationModel {
  notif_id: string;
  notif_type: string;
  notif_is_open: boolean;
  notif_post_ref: PostModel;
  notif_user_ref: UserModel;
  notif_created_at: Date;
  notif_updated_at: Date;
}
