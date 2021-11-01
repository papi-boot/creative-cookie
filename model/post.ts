export interface PostModel {
  post_id: string;
  post_created_by: string;
  post_content: string;
  post_tag: Array<string>;
  post_created_at: Date;
  post_updated_at: Date;
}
