export interface PostLikeRecord {
  plr_id: string;
  plr_post_ref: string;
  plr_user_ref: string;
  plr_status: boolean;
  plr_created_at: Date;
  plr_updated_at: Date;
}
